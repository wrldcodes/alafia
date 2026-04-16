"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealSectionProps extends ComponentPropsWithoutRef<"section"> {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

/**
 * Section wrapper for GSAP ScrollTrigger reveals.
 *
 * Inside the section, use data attributes (see `useGsapReveal`):
 * - data-reveal="up" | "clip" | "left" | "right" | "scale"
 * - data-stagger on a container to stagger its direct children
 * - data-parallax="0.2" for scrubbed parallax strength
 */
export function ScrollRevealSection({
  children,
  className,
  id,
  as: Component = "section",
}: ScrollRevealSectionProps) {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <Component ref={ref} id={id} className={cn(className)}>
      {children}
    </Component>
  );
}
