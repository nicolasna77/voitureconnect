"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/admin/nav-main";
import { NavUser } from "@/components/admin/nav-user";
import { TeamSwitcher } from "@/components/admin/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
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
          title: "Annonces",
          url: "/admin/listings",
        },
        {
          title: "Données",
          url: "/admin/data",
        },
        {
          title: "Abonnements",
          url: "/admin/subscriptions",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <h3 className="text-2xl font-bold text-primary text-center">
          CarConnect{" "}
          <span className="text-sm text-muted-foreground">Admin</span>
        </h3>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session?.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
