import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export default function AdminBlogNewPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Nouvel article</h1>
      </header>

      <div className="p-6 max-w-4xl">
        <BlogPostForm />
      </div>
    </>
  );
}
