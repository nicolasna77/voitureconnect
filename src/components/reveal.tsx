"use client";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Tailwind animation class applied when in view. Default: animate-fade-up */
  animation?: string;
  /** Delay in ms before the animation starts once in view */
  delay?: number;
}

/**
 * Thin client wrapper that animates children when they scroll into view.
 * Keep all static content as RSC children — only this wrapper is client JS.
 */
export function Reveal({
  children,
  className,
  animation = "animate-fade-up",
  delay = 0,
}: RevealProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={cn(
        isInView ? animation : "opacity-0",
        "motion-reduce:animate-none",
        className,
      )}
      style={delay > 0 ? { animationDelay: isInView ? `${delay}ms` : undefined } : undefined}
    >
      {children}
    </div>
  );
}
