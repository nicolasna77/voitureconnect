"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  initialContent?: string;
  placeholder?: string;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function CommentForm({
  onSubmit,
  initialContent = "",
  placeholder,
  isLoading = false,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const t = useTranslations("comments");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    if (!initialContent) setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder || t("placeholder")}
        aria-label={placeholder || t("placeholder")}
        maxLength={2000}
        rows={3}
        className="resize-none touch-manipulation"
        disabled={isLoading}
      />
      <div className="flex items-center gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
            className="touch-manipulation"
          >
            {t("cancel")}
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !content.trim()}
          className="touch-manipulation"
        >
          {isLoading && (
            <Loader2
              className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          )}
          {isLoading
            ? initialContent
              ? t("saving")
              : t("submitting")
            : initialContent
              ? t("save")
              : t("submit")}
        </Button>
      </div>
    </form>
  );
}
