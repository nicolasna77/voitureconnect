import React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
