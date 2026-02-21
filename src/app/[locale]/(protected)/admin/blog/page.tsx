import prisma from "@/prisma";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { BlogPostActions } from "@/components/admin/blog-post-actions";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
    },
  });

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold flex-1">Gestion du Blog</h1>
        <Button asChild size="sm">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-1" />
            Nouveau post
          </Link>
        </Button>
      </header>

      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Aucun article. Créez le premier !
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[280px] truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.status === "PUBLISHED" ? "default" : "secondary"}
                    >
                      {post.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.author.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <BlogPostActions post={post} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
