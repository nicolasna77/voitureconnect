"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Gauge } from "lucide-react";
import LoginMenu from "@/components/auth/login-menu";
import { useSession } from "@/lib/auth-client";
import { CreditBalance } from "@/components/credits/credit-balance";
import LocaleSwitcher from "@/components/local-switcher";
import { Separator } from "@/components/ui/separator";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu on Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    },
    [isMenuOpen],
  );

  // Focus trap: return focus to button when menu closes
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, handleKeyDown]);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      {/* Skip Link for keyboard users */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-60 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Aller au contenu principal
      </a>

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav
          aria-label="Navigation principale"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary motion-safe:transition-transform group-hover:scale-105">
                <Gauge className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                DriveMetric
              </span>
            </Link>

            {/* Desktop: Locale + Credits + User Menu */}
            <div className="hidden items-center gap-2 md:flex">
              <LocaleSwitcher />
              {session?.user && <CreditBalance />}
              <LoginMenu />
            </div>

            {/* Mobile: hamburger button only */}
            <div className="flex items-center md:hidden">
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </nav>

        {/* Mobile slide-down menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="border-t border-border bg-background md:hidden"
          >
            <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              <Link
                href="/blog"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Recherche
              </Link>

              <Separator className="my-3" />

              <div className="flex items-center gap-2 px-1 flex-wrap">
                <LocaleSwitcher />
                {session?.user && <CreditBalance />}
                <LoginMenu />
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
