"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/actions/comments";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import PaginationComponent from "@/components/component/pagination";
import { CommentForm } from "./comment-form";
import { CommentItem, type Comment } from "./comment-item";
import { useTranslations } from "next-intl";

interface CommentsSectionProps {
  generationId: number;
}

export function CommentsSection({ generationId }: CommentsSectionProps) {
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const t = useTranslations("comments");

  const { data, isLoading } = useQuery({
    queryKey: ["comments", generationId, page],
    queryFn: () => commentApi.getComments({ generationId, page }),
  });

  const createMutation = useMutation({
    mutationFn: commentApi.createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", generationId] });
      toast.success(t("createSuccess"));
    },
    onError: () => toast.error(t("createError")),
  });

  return (
    <section aria-labelledby="comments-heading">
      <Card>
        <CardHeader>
          <CardTitle id="comments-heading" className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" aria-hidden="true" />
            {t("title")}
            {data?.total > 0 && (
              <span className="text-muted-foreground font-normal text-sm tabular-nums">
                ({data.total})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comment form or login prompt */}
          {session?.user ? (
            <CommentForm
              onSubmit={(content) =>
                createMutation.mutate({ generationId, content })
              }
              isLoading={createMutation.isPending}
            />
          ) : (
            <div className="text-center py-4 border rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">
                {t("loginPrompt")}
              </p>
              <Button variant="outline" size="sm" asChild className="touch-manipulation">
                <Link href="/login">{t("loginButton")}</Link>
              </Button>
            </div>
          )}

          {/* Comments list */}
          <div aria-live="polite" aria-atomic="false">
            {isLoading ? (
              <div
                className="space-y-4"
                role="status"
                aria-label={t("loading")}
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 animate-pulse motion-reduce:animate-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.comments?.length > 0 ? (
              <div className="space-y-4">
                {data.comments.map((comment: Comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    generationId={generationId}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-4">
                {t("noComments")}
              </p>
            )}
          </div>

          {/* Pagination */}
          {data?.pages > 1 && (
            <nav aria-label={t("pagination")}>
              <PaginationComponent
                page={page}
                totalPages={data.pages}
                handlePageChange={setPage}
              />
            </nav>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
