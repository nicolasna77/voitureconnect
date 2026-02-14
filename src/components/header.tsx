"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Gauge } from "lucide-react";
import LoginMenu from "@/components/auth/login-menu";
import { useSession } from "@/lib/auth-client";
import { CreditBalance } from "@/components/credits/credit-balance";
import LocaleSwitcher from "@/components/local-switcher";

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
      // Focus first focusable element in menu
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
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary motion-safe:transition-transform group-hover:scale-105">
                <Gauge
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <span className="text-lg font-semibold text-foreground">
                CarMetrix
              </span>
            </Link>

            {/* Desktop: Locale + Credits + User Menu */}
            <div className="hidden items-center gap-2 md:flex">
              <LocaleSwitcher />
              {session?.user && <CreditBalance />}
              <LoginMenu />
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-2 md:hidden">
              <LocaleSwitcher />
              {session?.user && <CreditBalance />}
              <LoginMenu />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
