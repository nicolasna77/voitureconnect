"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Database,
  FileSpreadsheet,
  Image,
  Loader2,
  CheckCircle2,
  XCircle,
  Play,
  Upload,
} from "lucide-react";

type ScriptStatus = "idle" | "running" | "done" | "error";

interface LogEntry {
  message: string;
  type: "info" | "success" | "error";
  timestamp: Date;
}

function useScriptRunner() {
  const [status, setStatus] = useState<ScriptStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const abortRef = useRef(false);

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setLogs([]);
    abortRef.current = false;
  }, []);

  return { status, setStatus, progress, setProgress, logs, addLog, reset, abortRef };
}

const BATCH_SIZE = 50;
const LOGO_BATCH_SIZE = 5;

export default function AdminScriptsPage() {
  const checkData = useScriptRunner();
  const importFR = useScriptRunner();
  const importEN = useScriptRunner();
  const logos = useScriptRunner();

  const [fileFR, setFileFR] = useState<File | null>(null);
  const [fileEN, setFileEN] = useState<File | null>(null);

  // ─── Check Data ───
  const runCheckData = useCallback(async () => {
    checkData.reset();
    checkData.setStatus("running");
    checkData.addLog("Vérification des données...");

    try {
      const res = await fetch("/api/admin/scripts/check-data");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      checkData.addLog("=== FR ===", "info");
      checkData.addLog(
        `Types: ${data.fr.types} | Marques: ${data.fr.makes} | Modèles: ${data.fr.models} | Générations: ${data.fr.generations} | Trims: ${data.fr.trims}`,
        "success"
      );
      checkData.addLog("=== EN ===", "info");
      checkData.addLog(
        `Types: ${data.en.types} | Makes: ${data.en.makes} | Models: ${data.en.models} | Generations: ${data.en.generations} | Trims: ${data.en.trims}`,
        "success"
      );
      checkData.setStatus("done");
    } catch (error) {
      checkData.addLog(`Erreur: ${error}`, "error");
      checkData.setStatus("error");
    }
  }, [checkData]);

  // ─── Import FR ───
  const runImportFR = useCallback(async () => {
    if (!fileFR) return;
    importFR.reset();
    importFR.setStatus("running");

    try {
      // Phase 1: Parse (upload file)
      importFR.addLog("Phase 1/3 : Upload et lecture du fichier Excel FR...");
      const formData = new FormData();
      formData.append("file", fileFR);

      const parseRes = await fetch("/api/admin/scripts/import-car-data", {
        method: "POST",
        body: formData,
      });
      if (!parseRes.ok) throw new Error(`Parse failed: ${parseRes.status}`);
      const parseData = await parseRes.json();

      const rows: any[][] = parseData.rows;

      importFR.addLog(
        `${parseData.totalRows} lignes, ${parseData.bodyTypes.length} types, ${parseData.makes.length} marques, ${parseData.modelEntries.length} modèles, ${parseData.genEntries.length} générations`,
        "success"
      );
      importFR.setProgress(10);

      // Phase 2: Setup
      importFR.addLog("Phase 2/3 : Création des types, marques, modèles, générations, spécifications...");
      const setupRes = await fetch("/api/admin/scripts/import-car-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setup",
          bodyTypes: parseData.bodyTypes,
          makes: parseData.makes,
          modelEntries: parseData.modelEntries,
          genEntries: parseData.genEntries,
          specifications: parseData.specifications,
        }),
      });
      if (!setupRes.ok) throw new Error(`Setup failed: ${setupRes.status}`);
      const setupData = await setupRes.json();

      importFR.addLog(
        `Setup terminé : ${setupData.counts.types} types, ${setupData.counts.makes} marques, ${setupData.counts.models} modèles, ${setupData.counts.generations} générations, ${setupData.counts.specifications} spécifications`,
        "success"
      );
      importFR.setProgress(25);

      // Phase 3: Import batches (send row chunks)
      importFR.addLog("Phase 3/3 : Import des trims par batch...");
      const total = rows.length;
      let totalTrims = 0;
      let totalSpecValues = 0;

      for (let offset = 0; offset < total; offset += BATCH_SIZE) {
        if (importFR.abortRef.current) {
          importFR.addLog("Import annulé", "error");
          importFR.setStatus("error");
          return;
        }

        const chunk = rows.slice(offset, offset + BATCH_SIZE);

        const batchRes = await fetch("/api/admin/scripts/import-car-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "import-batch",
            rows: chunk,
            modelMap: setupData.modelMap,
            typeMap: setupData.typeMap,
            specMap: setupData.specMap,
          }),
        });
        if (!batchRes.ok) throw new Error(`Batch failed at offset ${offset}: ${batchRes.status}`);
        const batchData = await batchRes.json();

        totalTrims += batchData.trimCount;
        totalSpecValues += batchData.specValueCount;

        const nextOffset = offset + BATCH_SIZE;
        const pct = 25 + Math.round((nextOffset / total) * 75);
        importFR.setProgress(Math.min(pct, 100));
        importFR.addLog(
          `Batch ${Math.min(nextOffset, total)}/${total} — ${batchData.trimCount} trims, ${batchData.specValueCount} spec values`
        );
      }

      importFR.addLog(
        `Import FR terminé ! ${totalTrims} trims, ${totalSpecValues} spec values créés`,
        "success"
      );
      importFR.setProgress(100);
      importFR.setStatus("done");
    } catch (error) {
      importFR.addLog(`Erreur: ${error}`, "error");
      importFR.setStatus("error");
    }
  }, [importFR, fileFR]);

  // ─── Import EN ───
  const runImportEN = useCallback(async () => {
    if (!fileEN) return;
    importEN.reset();
    importEN.setStatus("running");

    try {
      // Phase 1: Parse (upload file)
      importEN.addLog("Phase 1/3 : Upload et lecture du fichier Excel EN...");
      const formData = new FormData();
      formData.append("file", fileEN);

      const parseRes = await fetch("/api/admin/scripts/import-car-data-en", {
        method: "POST",
        body: formData,
      });
      if (!parseRes.ok) throw new Error(`Parse failed: ${parseRes.status}`);
      const parseData = await parseRes.json();

      const rows: any[][] = parseData.rows;

      importEN.addLog(
        `${parseData.totalRows} rows, ${parseData.bodyTypes.length} types, ${parseData.makes.length} makes, ${parseData.modelEntries.length} models, ${parseData.genEntries.length} generations`,
        "success"
      );
      importEN.setProgress(10);

      // Phase 2: Setup
      importEN.addLog("Phase 2/3 : Creating types, makes, models, generations, specifications...");
      const setupRes = await fetch("/api/admin/scripts/import-car-data-en", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setup",
          bodyTypes: parseData.bodyTypes,
          makes: parseData.makes,
          modelEntries: parseData.modelEntries,
          genEntries: parseData.genEntries,
          specifications: parseData.specifications,
        }),
      });
      if (!setupRes.ok) throw new Error(`Setup failed: ${setupRes.status}`);
      const setupData = await setupRes.json();

      importEN.addLog(
        `Setup done: ${setupData.counts.types} types, ${setupData.counts.makes} makes, ${setupData.counts.models} models, ${setupData.counts.generations} generations, ${setupData.counts.specifications} specifications`,
        "success"
      );
      importEN.setProgress(25);

      // Phase 3: Import batches (send row chunks)
      importEN.addLog("Phase 3/3 : Importing trims in batches...");
      const total = rows.length;
      let totalTrims = 0;
      let totalSpecValues = 0;

      for (let offset = 0; offset < total; offset += BATCH_SIZE) {
        if (importEN.abortRef.current) {
          importEN.addLog("Import cancelled", "error");
          importEN.setStatus("error");
          return;
        }

        const chunk = rows.slice(offset, offset + BATCH_SIZE);

        const batchRes = await fetch("/api/admin/scripts/import-car-data-en", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "import-batch",
            rows: chunk,
            modelMap: setupData.modelMap,
            typeMap: setupData.typeMap,
            specMap: setupData.specMap,
          }),
        });
        if (!batchRes.ok) throw new Error(`Batch failed at offset ${offset}: ${batchRes.status}`);
        const batchData = await batchRes.json();

        totalTrims += batchData.trimCount;
        totalSpecValues += batchData.specValueCount;

        const nextOffset = offset + BATCH_SIZE;
        const pct = 25 + Math.round((nextOffset / total) * 75);
        importEN.setProgress(Math.min(pct, 100));
        importEN.addLog(
          `Batch ${Math.min(nextOffset, total)}/${total} — ${batchData.trimCount} trims, ${batchData.specValueCount} spec values`
        );
      }

      importEN.addLog(
        `Import EN done! ${totalTrims} trims, ${totalSpecValues} spec values created`,
        "success"
      );
      importEN.setProgress(100);
      importEN.setStatus("done");
    } catch (error) {
      importEN.addLog(`Error: ${error}`, "error");
      importEN.setStatus("error");
    }
  }, [importEN, fileEN]);

  // ─── Download Logos ───
  const runLogos = useCallback(async () => {
    logos.reset();
    logos.setStatus("running");

    try {
      // Phase 1: List brands
      logos.addLog("Récupération de la liste des marques...");
      const listRes = await fetch("/api/admin/scripts/download-logos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list" }),
      });
      if (!listRes.ok) throw new Error(`List failed: ${listRes.status}`);
      const listData = await listRes.json();

      logos.addLog(`${listData.total} marques trouvées`, "success");
      logos.setProgress(5);

      // Phase 2: Download in batches
      const brands: string[] = listData.brands;
      let success = 0;
      let failed = 0;

      for (let i = 0; i < brands.length; i += LOGO_BATCH_SIZE) {
        if (logos.abortRef.current) {
          logos.addLog("Téléchargement annulé", "error");
          logos.setStatus("error");
          return;
        }

        const batch = brands.slice(i, i + LOGO_BATCH_SIZE);
        const batchRes = await fetch("/api/admin/scripts/download-logos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "download-batch", brands: batch }),
        });
        if (!batchRes.ok) throw new Error(`Batch failed: ${batchRes.status}`);
        const batchData = await batchRes.json();

        for (const result of batchData.results) {
          if (result.url) {
            logos.addLog(`${result.brand} -> OK`, "success");
            success++;
          } else {
            logos.addLog(`${result.brand} -> ${result.error}`, "error");
            failed++;
          }
        }

        const pct = 5 + Math.round(((i + batch.length) / brands.length) * 95);
        logos.setProgress(Math.min(pct, 100));
      }

      logos.addLog(
        `Terminé ! ${success} succès, ${failed} échecs sur ${brands.length} marques`,
        success > 0 ? "success" : "error"
      );
      logos.setProgress(100);
      logos.setStatus("done");
    } catch (error) {
      logos.addLog(`Erreur: ${error}`, "error");
      logos.setStatus("error");
    }
  }, [logos]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Scripts de données</h1>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Check Data */}
          <ScriptCard
            title="Check Data"
            description="Vérifie les compteurs des tables FR et EN"
            icon={Database}
            status={checkData.status}
            progress={checkData.progress}
            logs={checkData.logs}
            onRun={runCheckData}
            showProgress={false}
          />

          {/* Import FR */}
          <ScriptCard
            title="Import FR"
            description="Importe les données Excel françaises (types, marques, modèles, trims, spécifications)"
            icon={FileSpreadsheet}
            status={importFR.status}
            progress={importFR.progress}
            logs={importFR.logs}
            onRun={runImportFR}
            disabled={!fileFR}
            fileInput={
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  className="h-8 text-xs"
                  onChange={(e) => setFileFR(e.target.files?.[0] || null)}
                />
              </div>
            }
          />

          {/* Import EN */}
          <ScriptCard
            title="Import EN"
            description="Importe les données Excel anglaises (types, makes, models, trims, specifications)"
            icon={FileSpreadsheet}
            status={importEN.status}
            progress={importEN.progress}
            logs={importEN.logs}
            onRun={runImportEN}
            disabled={!fileEN}
            fileInput={
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  type="file"
                  accept=".xlsx,.xls"
                  className="h-8 text-xs"
                  onChange={(e) => setFileEN(e.target.files?.[0] || null)}
                />
              </div>
            }
          />

          {/* Download Logos */}
          <ScriptCard
            title="Download Logos"
            description="Télécharge les logos des marques et les upload vers Vercel Blob"
            icon={Image}
            status={logos.status}
            progress={logos.progress}
            logs={logos.logs}
            onRun={runLogos}
          />
        </div>
      </div>
    </>
  );
}

function ScriptCard({
  title,
  description,
  icon: Icon,
  status,
  progress,
  logs,
  onRun,
  showProgress = true,
  disabled = false,
  fileInput,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: ScriptStatus;
  progress: number;
  logs: LogEntry[];
  onRun: () => void;
  showProgress?: boolean;
  disabled?: boolean;
  fileInput?: React.ReactNode;
}) {
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  const scrollToBottom = useCallback(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Scroll on new logs
  useEffect(() => {
    scrollToBottom();
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status === "done" && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {status === "error" && (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            <Button
              size="sm"
              onClick={onRun}
              disabled={status === "running" || disabled}
            >
              {status === "running" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  En cours...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Lancer
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {fileInput && (
          <div>{fileInput}</div>
        )}

        {showProgress && status !== "idle" && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {logs.length > 0 && (
          <ScrollArea className="h-48 rounded-md border bg-muted/50 p-3">
            <div className="space-y-1 font-mono text-xs">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.type === "success"
                      ? "text-green-600 dark:text-green-400"
                      : log.type === "error"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }
                >
                  <span className="opacity-50">
                    [{log.timestamp.toLocaleTimeString()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
