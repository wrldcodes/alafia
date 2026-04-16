"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealKind = "up" | "clip" | "left" | "right" | "scale";

function getRevealType(el: HTMLElement): RevealKind {
  const v = el.getAttribute("data-reveal");
  if (v === "clip" || v === "left" || v === "right" || v === "scale" || v === "up")
    return v;
  return "up";
}

function scrubStrength(): number {
  if (typeof window === "undefined") return 0.85;
  return window.matchMedia("(max-width: 640px)").matches ? 0.55 : 0.88;
}

/** Scroll-driven from state — motion follows finger / wheel both ways */
function fromVars(type: RevealKind): gsap.TweenVars {
  switch (type) {
    case "clip":
      return {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0.35,
        y: 12,
      };
    case "left":
      return { opacity: 0.15, x: -88, rotateZ: -4, filter: "blur(4px)" };
    case "right":
      return { opacity: 0.15, x: 88, rotateZ: 4, filter: "blur(4px)" };
    case "scale":
      return { opacity: 0.2, scale: 0.82, y: 56, rotateZ: -1.5 };
    default:
      return { opacity: 0.2, y: 72, rotateZ: -1.2, filter: "blur(3px)" };
  }
}

function toVars(type: RevealKind): gsap.TweenVars {
  switch (type) {
    case "clip":
      return {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "none",
      };
    case "left":
    case "right":
      return {
        opacity: 1,
        x: 0,
        rotateZ: 0,
        filter: "blur(0px)",
        ease: "none",
      };
    case "scale":
      return {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateZ: 0,
        ease: "none",
      };
    default:
      return {
        opacity: 1,
        y: 0,
        rotateZ: 0,
        filter: "blur(0px)",
        ease: "none",
      };
  }
}

function scrollRange(el: HTMLElement): { start: string; end: string } {
  if (el.hasAttribute("data-reveal-tight")) {
    return { start: "top 90%", end: "top 42%" };
  }
  return { start: "top 88%", end: "top 36%" };
}

/**
 * Section-level scroll FX (scrubbed — scroll up/down drives progress):
 *
 * - `data-reveal` — scroll-scrubbed entrance (not a one-shot toggle).
 * - `data-reveal-tight` — shorter scroll span (snappier).
 * - `data-stagger` — direct children scrub in sequence on one timeline.
 * - `data-parallax="0.2"` — vertical + slight scale drift (scrub).
 * - `data-parallax-img="0.35"` — wrap a `<img>` (e.g. next/image); inner moves faster (depth).
 */
export function useGsapReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(root.querySelectorAll("[data-reveal], [data-stagger] > *, [data-parallax], [data-parallax-img] img"), {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateZ: 0,
          clipPath: "none",
          filter: "none",
        });
        return;
      }

      const scrub = scrubStrength();

      // Inner image parallax (wrapper must overflow-hidden)
      root.querySelectorAll<HTMLElement>("[data-parallax-img]").forEach((wrap) => {
        const inner = wrap.querySelector<HTMLImageElement>("img");
        if (!inner) return;
        const raw = wrap.getAttribute("data-parallax-img") ?? "0.3";
        const n = Number.parseFloat(raw);
        const amt = Number.isFinite(n) ? Math.min(1.2, Math.max(0.05, n)) : 0.3;
        gsap.fromTo(
          inner,
          { yPercent: -22 * amt, scale: 1.06 },
          {
            yPercent: 22 * amt,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Section / element parallax (whole node)
      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const raw = el.getAttribute("data-parallax") ?? "0.15";
        const n = Number.parseFloat(raw);
        const amt = Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.15;
        gsap.fromTo(
          el,
          { y: 64 * amt, scale: 0.97 },
          {
            y: -64 * amt,
            scale: 1.03,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Stagger grid: one scrubbed timeline across children
      root.querySelectorAll<HTMLElement>("[data-stagger]").forEach((staggerRoot) => {
        const kids = Array.from(staggerRoot.children) as HTMLElement[];
        if (kids.length === 0) return;

        const span = Math.min(520, 140 + kids.length * 95);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: staggerRoot,
            start: "top 78%",
            end: `+=${span}`,
            scrub,
          },
        });

        kids.forEach((child, i) => {
          const t = getRevealType(child);
          tl.fromTo(
            child,
            fromVars(t),
            { ...toVars(t), immediateRender: false, overwrite: "auto" },
            i * 0.22,
          );
        });
      });

      // Standalone reveals (not inside [data-stagger])
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.closest("[data-stagger]")) return;
        const type = getRevealType(el);
        const { start, end } = scrollRange(el);
        gsap.fromTo(el, fromVars(type), {
          ...toVars(type),
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub,
          },
        });
      });
    }, root);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);

  return ref;
}
