"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
  isLoading?: boolean;
}

export function ReportDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: ReportDialogProps) {
  const [reason, setReason] = useState("");
  const t = useTranslations("comments");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overscroll-contain">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t("reportTitle")}</DialogTitle>
            <DialogDescription>{t("reportDescription")}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("reportPlaceholder")}
              aria-label={t("reportPlaceholder")}
              maxLength={500}
              rows={3}
              className="resize-none touch-manipulation"
              disabled={isLoading}
              autoFocus={false}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="touch-manipulation"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || !reason.trim()}
              className="touch-manipulation"
            >
              {isLoading && (
                <Loader2
                  className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              )}
              {t("reportSubmit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
