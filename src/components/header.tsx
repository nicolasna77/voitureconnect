"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Gauge, Search } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { CreditBalance } from "@/components/credits/credit-balance";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchWithFilters } from "@/components/specification/search-with-filters";

const LoginMenu = dynamic(() => import("@/components/auth/login-menu"), {
  ssr: false,
  loading: () => <Skeleton className="h-9 w-9 rounded-full" />,
});

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close menu and search on route change — derived state during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (isMenuOpen) setIsMenuOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  }

  // Close on Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isSearchOpen) {
          setIsSearchOpen(false);
          return;
        }
        if (isMenuOpen) {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    },
    [isMenuOpen, isSearchOpen],
  );

  // Focus trap: move focus into menu when it opens
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

  // Also listen to Escape when search is open (not inside menu)
  useEffect(() => {
    if (!isSearchOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, handleKeyDown]);

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

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    if (isMenuOpen) setIsMenuOpen(false);
  };

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

            {/* Mobile: Search icon + LoginMenu + hamburger — col 3 */}
            <div className="flex items-center justify-end gap-1 md:hidden">
              <Button
                variant="ghost"
                size="icon"
                aria-label={isSearchOpen ? "Fermer la recherche" : "Rechercher"}
                aria-expanded={isSearchOpen}
                onClick={toggleSearch}
              >
                {isSearchOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Search className="h-5 w-5" aria-hidden="true" />
                )}
              </Button>
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

          {/* Mobile: collapsible search row */}
          {isSearchOpen && (
            <div className="pb-3 md:hidden animate-fade-up motion-reduce:animate-none">
              <SearchWithFilters className="w-full" autoFocus />
            </div>
          )}
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
