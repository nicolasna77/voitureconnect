import { getCachedSession } from "@/lib/cached-session";
import { redirect } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BlogGenerator } from "@/components/admin/blog-generator";

export default async function AdminBlogGeneratePage() {
  const session = await getCachedSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-lg font-semibold">Générer des articles avec l&apos;IA</h1>
      </header>

      <div className="p-6 max-w-5xl">
        <BlogGenerator />
      </div>
    </>
  );
}
