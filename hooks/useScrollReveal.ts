"use client";

import { useEffect, useRef } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  staggerMs?: number;
}

export function useScrollReveal<T extends HTMLElement>({
  threshold = 0.12,
  staggerMs = 80,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const revealTargets = Array.from(
      root.querySelectorAll<HTMLElement>(".reveal, [data-reveal]"),
    );

    if (revealTargets.length === 0) {
      return;
    }

    // Support both legacy data-reveal and class-based reveal markup.
    revealTargets.forEach((target) => {
      if (!target.classList.contains("reveal")) {
        target.classList.add("reveal");
      }

      const variant = target.getAttribute("data-reveal");
      if (!variant) return;

      if (variant === "left") target.classList.add("reveal-left");
      else if (variant === "right") target.classList.add("reveal-right");
      else if (variant === "scale") target.classList.add("reveal-scale");
      else if (variant === "fade" || variant === "clip") target.classList.add("reveal-fade");
      else target.classList.add("reveal-up");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("revealed");
          } else {
            target.classList.remove("revealed");
          }
        });
      },
      { threshold },
    );

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${index * staggerMs}ms`;
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
    };
  }, [staggerMs, threshold]);

  return ref;
}
