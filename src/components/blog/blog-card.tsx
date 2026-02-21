import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    coverImage: string | null;
    publishedAt: Date | string | null;
    author: { name: string };
  };
  locale: string;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(
        locale === "fr" ? "fr-FR" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      {post.coverImage ? (
        <div className="relative h-48 w-full shrink-0">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : (
        <div className="h-48 w-full bg-muted flex items-center justify-center shrink-0">
          <span className="text-muted-foreground text-sm">Pas d&apos;image</span>
        </div>
      )}

      <CardContent className="flex-1 p-5">
        <h2 className="text-lg font-semibold leading-tight mb-2 line-clamp-2">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {post.excerpt}
          </p>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-0 flex items-center justify-between">
        {publishedDate ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {publishedDate}
          </div>
        ) : (
          <span />
        )}

        <Badge variant="outline" className="text-xs">
          <Link href={`/blog/${post.slug}`}>Lire la suite →</Link>
        </Badge>
      </CardFooter>
    </Card>
  );
}
