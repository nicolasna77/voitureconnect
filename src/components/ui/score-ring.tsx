"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  /** Score 0–100 */
  score: number;
  /** SVG diameter in px */
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getRingColor(score: number) {
  if (score >= 70) return "stroke-emerald-500";
  if (score >= 40) return "stroke-amber-500";
  return "stroke-red-500";
}

function getTextColor(score: number) {
  if (score >= 70) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export function ScoreRing({
  score,
  size = 88,
  strokeWidth = 8,
  className,
}: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      rafRef.current = requestAnimationFrame(() => setDisplayed(score));
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const duration = 900;
    let start: number | null = null;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className
      )}
      role="img"
      aria-label={`Score de fiabilité : ${score} sur 100`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={cn("transition-none", getRingColor(score))}
        />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "text-xl font-bold tabular-nums leading-none",
            getTextColor(score)
          )}
        >
          {displayed}
        </span>
        <span className="text-[10px] text-muted-foreground leading-none mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
}
