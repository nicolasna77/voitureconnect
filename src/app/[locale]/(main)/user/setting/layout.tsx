import React from "react";
import { Metadata } from "next";
import { SidebarNav } from "@/components/sidebar-nav";
const sidebarNavItems = [
  {
    title: "Profile",
    href: "/user/setting/profile",
  },
  {
    title: "Abonnements",
    href: "/user/setting/subscriptions",
  },
  {
    title: "Conversations",
    href: "/user/setting/conversations",
  },
];
export const metadata: Metadata = {
  title: "Paramètres",
  description: "Paramètres de l'utilisateur.",
};
const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside className="-mx-4 lg:w-1/5 bg-background border rounded-lg p-4">
        <SidebarNav items={sidebarNavItems} />
      </aside>

      <div className="w-full">{children}</div>
    </div>
  );
};
export default SettingLayout;
