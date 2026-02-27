"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Gauge } from "lucide-react";
import LoginMenu from "@/components/auth/login-menu";
import { useSession } from "@/lib/auth-client";
import { CreditBalance } from "@/components/credits/credit-balance";
import { Separator } from "@/components/ui/separator";
import { SearchWithFilters } from "@/components/specification/search-with-filters";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu on Escape key
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  }, []);

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
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav
          aria-label="Navigation principale"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          {/* Main row */}
          <div className="grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* Logo — col 1 */}
            <Link
              href="/"
              aria-label="VoitureConnect — Accueil"
              className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary motion-safe:transition-transform group-hover:scale-105">
                <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
            </Link>

            {/* Desktop: Search bar + filters — col 2, centered */}
            <div className="hidden items-center justify-center px-4 md:flex">
              <SearchWithFilters className="w-full max-w-xl" />
            </div>

            {/* Desktop: Blog + Locale + Credits + User Menu — col 3, right-aligned */}
            <div className="hidden items-center justify-end gap-3 md:flex">
              <Link
                href="/blog"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Blog
              </Link>
              <Separator orientation="vertical" className="h-5 bg-accent" />
              {session?.user && <CreditBalance />}
              <LoginMenu />
            </div>

            {/* Mobile: LoginMenu + hamburger — col 3 */}
            <div className="flex items-center justify-end gap-1 md:hidden">
              <LoginMenu />
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
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile: search row (always visible) */}
          <div className="pb-3 md:hidden">
            <SearchWithFilters className="w-full" />
          </div>
        </nav>

        {/* Mobile slide-down menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="border-t border-border bg-background md:hidden"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
              <Link
                href="/blog"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>

              <Separator />

              <div className="flex items-center justify-between gap-2 px-1 flex-wrap">
                {session?.user && <CreditBalance />}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
