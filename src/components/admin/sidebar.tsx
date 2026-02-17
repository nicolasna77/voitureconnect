"use client";

import * as React from "react";

import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/admin/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      items: [
        {
          title: "Vue d'ensemble",
          url: "/admin",
        },
        {
          title: "Analytiques",
          url: "/admin/analytics",
        },
      ],
    },
    {
      title: "Gestion",
      url: "#",
      items: [
        {
          title: "Utilisateurs",
          url: "/admin/users",
        },
        {
          title: "Abonnements",
          url: "/admin/subscriptions",
        },
        {
          title: "Scripts",
          url: "/admin/scripts",
        },
        {
          title: "Signalements",
          url: "/admin/reports",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="overflow-hidden" aria-label="CarConnect Admin">
        {collapsed ? (
          <span
            className="text-lg font-bold text-primary text-center"
            aria-hidden="true"
          >
            C
          </span>
        ) : (
          <h3 className="text-2xl font-bold text-primary text-center whitespace-nowrap">
            DriveMetric{" "}
            <span className="text-sm text-muted-foreground">Admin</span>
          </h3>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user as any} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
