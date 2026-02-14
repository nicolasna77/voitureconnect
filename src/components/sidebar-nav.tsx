"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SidebarNavItem {
  href: string;
  title: string;
  icon?: LucideIcon;
  description?: string;
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  // Extract the last part of the path for comparison
  const isActive = (href: string) => {
    const pathParts = pathname.split("/").filter(Boolean);
    const hrefParts = href.split("/").filter(Boolean);

    // Compare the last parts
    const pathEnd = pathParts.slice(-2).join("/");
    const hrefEnd = hrefParts.slice(-2).join("/");

    return pathEnd === hrefEnd;
  };

  return (
    <nav
      className={cn("flex flex-col gap-1", className)}
      aria-label="Navigation des paramètres"
      {...props}
    >
      {items.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            {Icon && (
              <Icon
                className={cn("h-4 w-4 shrink-0", active && "text-primary")}
                aria-hidden="true"
              />
            )}
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
