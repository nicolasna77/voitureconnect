"use client";

import React from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { User, CreditCard, Coins, Settings, Heart, History } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Profil",
    href: "/setting/profile",
    icon: User,
  },
  {
    title: "Favoris",
    href: "/setting/favorites",
    icon: Heart,
  },
  {
    title: "Historique",
    href: "/setting/history",
    icon: History,
  },
  {
    title: "Crédits",
    href: "/setting/credits",
    icon: Coins,
  },
  {
    title: "Abonnements",
    href: "/setting/subscriptions",
    icon: CreditCard,
  },
];

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-sm text-muted-foreground">
              Gérez votre compte et vos préférences
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="rounded-xl border border-border bg-card p-4">
            <SidebarNav items={sidebarNavItems} />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default SettingLayout;
