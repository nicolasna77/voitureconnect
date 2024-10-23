import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { SidebarNav } from "@/components/sidebar-nav";
import { Card, CardContent } from "@/components/ui/card";
const sidebarNavItems = [
  {
    title: "Profile",
    href: "/user/setting/profile",
  },
  {
    title: "Abonnements",
    href: "/user/setting/building",
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
    <>
      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <Card className="w-full ">
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </>
  );
};
export default SettingLayout;
