"use client";
import { useSession } from "next-auth/react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();

  return (
    <div className="container m-auto min-h-[calc(100vh_-_theme(spacing.16))] py-8 px-4">
      {children}
    </div>
  );
}
