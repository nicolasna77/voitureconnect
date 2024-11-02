import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";

export default async function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/pro");
  return <div className="">{children}</div>;
}
