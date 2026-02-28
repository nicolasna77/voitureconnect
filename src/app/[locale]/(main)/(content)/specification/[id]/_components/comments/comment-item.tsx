"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/actions/comments";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageSquare, Pencil, Trash2, Flag, Loader2 } from "lucide-react";
import { CommentForm } from "./comment-form";
import { ReportDialog } from "./report-dialog";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const dateFormatters = new Map<string, Intl.DateTimeFormat>();
function getDateFormatter(locale: string) {
  let fmt = dateFormatters.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    dateFormatters.set(locale, fmt);
  }
  return fmt;
}

function useDateFormatter(locale: string, dateStr: string) {
  return useMemo(
    () => getDateFormatter(locale).format(new Date(dateStr)),
    [locale, dateStr]
  );
}

interface CommentUser {
  id: string;
  name: string;
  picture: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: CommentUser;
  generationId: number;
  parentId: string | null;
  content: string;
  isEdited: boolean;
  createdAt: string;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  generationId: number;
  isReply?: boolean;
}

export function CommentItem({
  comment,
  generationId,
  isReply = false,
}: CommentItemProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const t = useTranslations("comments");
  const locale = useLocale();

  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const isOwner = session?.user?.id === comment.userId;
  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = !!session?.user;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", generationId] });

  const replyMutation = useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: () => {
      invalidate();
      setIsReplying(false);
      toast.success(t("replySuccess"));
    },
    onError: () => toast.error(t("replyError")),
  });

  const editMutation = useMutation({
    mutationFn: commentApi.updateComment,
    onSuccess: () => {
      invalidate();
      setIsEditing(false);
      toast.success(t("editSuccess"));
    },
    onError: () => toast.error(t("editError")),
  });

  const deleteMutation = useMutation({
    mutationFn: commentApi.deleteComment,
    onSuccess: () => {
      invalidate();
      setShowDeleteDialog(false);
      toast.success(t("deleteSuccess"));
    },
    onError: () => toast.error(t("deleteError")),
  });

  const reportMutation = useMutation({
    mutationFn: commentApi.reportComment,
    onSuccess: () => {
      setShowReportDialog(false);
      toast.success(t("reportSuccess"));
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error(t("alreadyReported"));
      } else {
        toast.error(t("reportError"));
      }
    },
  });

  const formattedDate = useDateFormatter(locale, comment.createdAt);

  return (
    <article
      className={isReply ? "ml-8 mt-3" : ""}
      aria-label={t("commentBy", { name: comment.user.name })}
    >
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={comment.user.picture} alt="" />
          <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{comment.user.name}</span>
            <time
              dateTime={comment.createdAt}
              className="text-xs text-muted-foreground"
            >
              {formattedDate}
            </time>
            {comment.isEdited && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {t("edited")}
              </Badge>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                initialContent={comment.content}
                onSubmit={(content) =>
                  editMutation.mutate({ commentId: comment.id, content })
                }
                isLoading={editMutation.isPending}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <p className="mt-1 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          )}

          {/* Action buttons */}
          {!isEditing && (
            <div className="flex items-center gap-1 mt-2" role="group" aria-label={t("actions")}>
              {/* Reply - only on root comments, for logged-in users */}
              {!isReply && isLoggedIn && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs touch-manipulation"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  {t("reply")}
                </Button>
              )}

              {/* Edit - owner only */}
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs touch-manipulation"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  {t("edit")}
                </Button>
              )}

              {/* Delete - owner or admin */}
              {(isOwner || isAdmin) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-destructive hover:text-destructive touch-manipulation"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  {t("delete")}
                </Button>
              )}

              {/* Report - logged-in users, not own comment */}
              {isLoggedIn && !isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs touch-manipulation"
                  onClick={() => setShowReportDialog(true)}
                >
                  <Flag className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                  {t("report")}
                </Button>
              )}
            </div>
          )}

          {/* Reply form */}
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                placeholder={t("replyPlaceholder")}
                onSubmit={(content) =>
                  replyMutation.mutate({
                    generationId,
                    content,
                    parentId: comment.id,
                  })
                }
                isLoading={replyMutation.isPending}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              generationId={generationId}
              isReply
            />
          ))}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="overscroll-contain">
          <DialogHeader>
            <DialogTitle>{t("deleteTitle")}</DialogTitle>
            <DialogDescription>{t("deleteDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="touch-manipulation"
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate(comment.id)}
              disabled={deleteMutation.isPending}
              className="touch-manipulation"
            >
              {deleteMutation.isPending && (
                <Loader2
                  className="w-4 h-4 mr-2 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              )}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report dialog */}
      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        onSubmit={(reason) =>
          reportMutation.mutate({ commentId: comment.id, reason })
        }
        isLoading={reportMutation.isPending}
      />
    </article>
  );
}
