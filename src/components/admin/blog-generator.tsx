"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2, Globe, Lightbulb, FileText, Save, Check } from "lucide-react";

// ─── Markdown/plain-text → HTML normalizer ────────────────────────────────────
// llama3.2 sometimes ignores HTML instructions and outputs markdown or plain
// text. This converter handles the most common patterns so Tiptap gets clean HTML.

function normalizeToHtml(raw: string): string {
  // Already looks like HTML — return as-is
  if (/<(p|h[1-6]|ul|ol|li|strong|em|blockquote)\b/i.test(raw)) return raw;

  const result: string[] = [];
  let inList = false;

  // Split into logical paragraphs (blank-line separated or single lines)
  const lines = raw.split("\n");

  for (const line of lines) {
    const t = line.trim();

    if (!t) {
      if (inList) { result.push("</ul>"); inList = false; }
      continue;
    }

    // Headings: ## Title  or  ### Title
    const headingMatch = t.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (inList) { result.push("</ul>"); inList = false; }
      const level = Math.min(headingMatch[1].length, 6);
      result.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Bullet list items: - item  or  * item
    if (/^[-*]\s+/.test(t)) {
      if (!inList) { result.push("<ul>"); inList = true; }
      result.push(`<li>${inlineMarkdown(t.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    // Regular paragraph
    if (inList) { result.push("</ul>"); inList = false; }
    result.push(`<p>${inlineMarkdown(t)}</p>`);
  }

  if (inList) result.push("</ul>");
  return result.join("");
}

/** Convert inline markdown (**bold**, *italic*) to HTML */
function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScrapedArticle {
  url: string;
  title: string;
  text: string;
}

interface Topic {
  title: string;
  description: string;
  keywords: string[];
  sourceUrls: string[];
}

interface GeneratedArticle {
  topic: Topic;
  content: string;
  saved: boolean;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepBadge({
  n,
  active,
  done,
}: {
  n: number;
  active: boolean;
  done: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold border-2 ${
        done
          ? "bg-green-500 border-green-500 text-white"
          : active
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground text-muted-foreground"
      }`}
    >
      {done ? <Check className="h-4 w-4" /> : n}
    </span>
  );
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BlogGenerator() {
  // Step 1 — Sources
  const [urlsText, setUrlsText] = useState("");
  const [scraping, setScraping] = useState(false);
  const [articles, setArticles] = useState<ScrapedArticle[]>([]);
  const [selectedArticleIndexes, setSelectedArticleIndexes] = useState<
    Set<number>
  >(new Set());

  // Step 2 — Topics
  const [generatingTopics, setGeneratingTopics] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIndexes, setSelectedTopicIndexes] = useState<Set<number>>(
    new Set()
  );

  // Step 3 — Generated articles
  const [generatedArticles, setGeneratedArticles] = useState<
    GeneratedArticle[]
  >([]);
  const [generatingIndex, setGeneratingIndex] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  // ── STEP 1: Scrape ─────────────────────────────────────────────────────────

  async function handleScrape() {
    setError(null);
    const urls = urlsText
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) {
      setError("Entrez au moins une URL.");
      return;
    }
    setScraping(true);
    try {
      const res = await fetch("/api/admin/blog/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setArticles(data.articles ?? []);
      setSelectedArticleIndexes(
        new Set((data.articles ?? []).map((_: unknown, i: number) => i))
      );
      setTopics([]);
      setGeneratedArticles([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setScraping(false);
    }
  }

  function toggleArticle(i: number) {
    setSelectedArticleIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  // ── STEP 2: Topics ─────────────────────────────────────────────────────────

  async function handleGenerateTopics() {
    setError(null);
    const selected = articles.filter((_, i) => selectedArticleIndexes.has(i));
    if (selected.length === 0) {
      setError("Sélectionnez au moins un article.");
      return;
    }
    setGeneratingTopics(true);
    try {
      const res = await fetch("/api/admin/blog/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articles: selected }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTopics(data.topics ?? []);
      setSelectedTopicIndexes(
        new Set((data.topics ?? []).map((_: unknown, i: number) => i))
      );
      setGeneratedArticles([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setGeneratingTopics(false);
    }
  }

  function toggleTopic(i: number) {
    setSelectedTopicIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  // ── STEP 3: Generate articles ──────────────────────────────────────────────

  async function handleGenerateArticle(topicIndex: number) {
    setError(null);
    const topic = topics[topicIndex];
    const sourceContent = articles
      .filter((_, i) => selectedArticleIndexes.has(i))
      .map((a) => `# ${a.title}\n${a.text}`)
      .join("\n\n---\n\n");

    // Insert placeholder if not already there
    setGeneratedArticles((prev) => {
      const exists = prev.find((g) => g.topic.title === topic.title);
      if (exists) return prev;
      return [...prev, { topic, content: "", saved: false }];
    });

    setGeneratingIndex(topicIndex);

    try {
      const res = await fetch("/api/admin/blog/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, sourceContent }),
      });
      if (!res.ok) throw new Error(await res.text());

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        setGeneratedArticles((prev) =>
          prev.map((g) =>
            g.topic.title === topic.title
              ? { ...g, content: accumulated }
              : g
          )
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setGeneratingIndex(null);
    }
  }

  async function handleSaveDraft(articleIndex: number) {
    setError(null);
    const article = generatedArticles[articleIndex];
    if (!article) return;

    setSavingIndex(articleIndex);
    try {
      const slug = slugify(article.topic.title) + "-" + Date.now();
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.topic.title,
          slug,
          excerpt: article.topic.description,
          content: normalizeToHtml(article.content),
          status: "DRAFT",
        }),
      });
      if (!res.ok) throw new Error(await res.text());

      setGeneratedArticles((prev) =>
        prev.map((g, i) => (i === articleIndex ? { ...g, saved: true } : g))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSavingIndex(null);
    }
  }

  // ── Derived state ───────────────────────────────────────────────────────────

  const step =
    topics.length > 0 ? 3 : articles.length > 0 ? 2 : 1;

  const selectedTopics = topics.filter((_, i) => selectedTopicIndexes.has(i));

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── STEP 1: Sources ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <StepBadge n={1} active={step === 1} done={step > 1} />
          <div>
            <h2 className="font-semibold text-base">Sources</h2>
            <p className="text-sm text-muted-foreground">
              Entrez une URL par ligne (page d&apos;accueil ou catégorie d&apos;un site auto)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Textarea
            placeholder={"https://www.caradisiac.com\nhttps://www.largus.fr"}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            rows={4}
            className="font-mono text-sm"
          />
          <Button onClick={handleScrape} disabled={scraping}>
            {scraping ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scraping en cours…
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Scrapper
              </>
            )}
          </Button>
        </div>

        {articles.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {articles.length} article(s) trouvé(s) —{" "}
                <span className="text-muted-foreground">
                  {selectedArticleIndexes.size} sélectionné(s)
                </span>
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSelectedArticleIndexes(
                    selectedArticleIndexes.size === articles.length
                      ? new Set()
                      : new Set(articles.map((_, i) => i))
                  )
                }
              >
                {selectedArticleIndexes.size === articles.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto border rounded-md divide-y">
              {articles.map((a, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 px-3 py-2 hover:bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedArticleIndexes.has(i)}
                    onCheckedChange={() => toggleArticle(i)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.url}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── STEP 2: Topics ──────────────────────────────────────────────────── */}
      {articles.length > 0 && (
        <>
          <Separator />
          <section>
            <div className="flex items-center gap-3 mb-4">
              <StepBadge n={2} active={step === 2} done={step > 2} />
              <div>
                <h2 className="font-semibold text-base">Sujets</h2>
                <p className="text-sm text-muted-foreground">
                  L&apos;IA analyse les articles et suggère des sujets pour votre blog
                </p>
              </div>
            </div>

            <Button
              onClick={handleGenerateTopics}
              disabled={generatingTopics || selectedArticleIndexes.size === 0}
            >
              {generatingTopics ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Générer les sujets
                </>
              )}
            </Button>

            {topics.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {topics.map((t, i) => (
                  <Card
                    key={i}
                    className={`cursor-pointer transition-colors ${
                      selectedTopicIndexes.has(i)
                        ? "border-primary ring-1 ring-primary"
                        : "border-border"
                    }`}
                    onClick={() => toggleTopic(i)}
                  >
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-start gap-2">
                        <Checkbox
                          checked={selectedTopicIndexes.has(i)}
                          onCheckedChange={() => toggleTopic(i)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-0.5 shrink-0"
                        />
                        <CardTitle className="text-sm font-semibold leading-snug">
                          {t.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        {t.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {t.keywords.map((kw) => (
                          <Badge
                            key={kw}
                            variant="secondary"
                            className="text-xs"
                          >
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ── STEP 3: Generate articles ────────────────────────────────────────── */}
      {topics.length > 0 && selectedTopics.length > 0 && (
        <>
          <Separator />
          <section>
            <div className="flex items-center gap-3 mb-4">
              <StepBadge n={3} active={step >= 3} done={false} />
              <div>
                <h2 className="font-semibold text-base">Génération</h2>
                <p className="text-sm text-muted-foreground">
                  Générez et sauvegardez chaque article en brouillon
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {selectedTopics.map((topic, idx) => {
                const topicIndex = topics.indexOf(topic);
                const generated = generatedArticles.find(
                  (g) => g.topic.title === topic.title
                );
                const isGenerating = generatingIndex === topicIndex;
                const generatedIdx = generatedArticles.findIndex(
                  (g) => g.topic.title === topic.title
                );

                return (
                  <Card key={idx}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-sm font-semibold">
                          {topic.title}
                        </CardTitle>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateArticle(topicIndex)}
                            disabled={isGenerating || generatingIndex !== null}
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                Rédaction…
                              </>
                            ) : (
                              <>
                                <FileText className="h-3 w-3 mr-1.5" />
                                {generated ? "Régénérer" : "Générer"}
                              </>
                            )}
                          </Button>
                          {generated && generated.content && (
                            <Button
                              size="sm"
                              onClick={() => handleSaveDraft(generatedIdx)}
                              disabled={
                                savingIndex === generatedIdx || generated.saved
                              }
                              variant={generated.saved ? "secondary" : "default"}
                            >
                              {savingIndex === generatedIdx ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                  Sauvegarde…
                                </>
                              ) : generated.saved ? (
                                <>
                                  <Check className="h-3 w-3 mr-1.5" />
                                  Sauvegardé
                                </>
                              ) : (
                                <>
                                  <Save className="h-3 w-3 mr-1.5" />
                                  Brouillon
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    {generated && (
                      <CardContent className="pt-0">
                        <Textarea
                          value={generated.content}
                          onChange={(e) =>
                            setGeneratedArticles((prev) =>
                              prev.map((g) =>
                                g.topic.title === topic.title
                                  ? { ...g, content: e.target.value }
                                  : g
                              )
                            )
                          }
                          rows={16}
                          className="font-mono text-xs"
                          placeholder="Le contenu généré apparaîtra ici…"
                        />
                        {generated.saved && (
                          <p className="text-xs text-green-600 mt-2">
                            Article sauvegardé en brouillon — retrouvez-le dans{" "}
                            <Link
                              href="/admin/blog"
                              className="underline hover:no-underline"
                            >
                              la liste des articles
                            </Link>
                            .
                          </p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
