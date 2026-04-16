"use client";

import { type RefObject, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Loads on mount: badge → (headline + doctor visual together) → subcopy → CTA cards stagger.
 * Testimonial: back.out(1.4). Background orbs: infinite float loop.
 */
export function useHeroAnimation(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const badge = root.querySelector("[data-hero='badge']");
      const headline = root.querySelector("[data-hero='headline']");
      const subcopy = root.querySelector("[data-hero='subcopy']");
      const ctas = root.querySelectorAll("[data-hero='cta']");
      const visual = root.querySelector("[data-hero='visual']");
      const testimonial = root.querySelector("[data-hero='testimonial']");
      const testimonialTilt = root.querySelector<HTMLElement>(
        "[data-hero='testimonial-tilt']",
      );
      const orbs = root.querySelectorAll("[data-hero='orb']");

      if (reduced) {
        const nodes = [
          ...root.querySelectorAll("[data-hero]"),
          ...Array.from(ctas),
        ];
        gsap.set(nodes, {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      if (badge) gsap.set(badge, { opacity: 0, y: 18 });
      if (headline) gsap.set(headline, { opacity: 0, y: 32 });
      if (subcopy) gsap.set(subcopy, { opacity: 0, y: 22 });
      if (ctas.length) gsap.set(ctas, { opacity: 0, y: 24 });
      if (visual) gsap.set(visual, { opacity: 0, x: 72 });
      if (testimonial) gsap.set(testimonial, { opacity: 0, y: 28 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (badge) {
        tl.to(badge, { opacity: 1, y: 0, duration: 0.55 }, 0);
        tl.addLabel("sync", 0.58);
      } else {
        tl.addLabel("sync", 0);
      }
      if (headline)
        tl.to(headline, { opacity: 1, y: 0, duration: 0.78 }, "sync");
      if (visual)
        tl.to(visual, { opacity: 1, x: 0, duration: 0.82 }, "sync");
      if (subcopy)
        tl.to(subcopy, { opacity: 1, y: 0, duration: 0.58 }, "sync+=0.18");
      if (ctas.length)
        tl.to(
          ctas,
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 },
          "-=0.2",
        );
      if (testimonial)
        tl.to(
          testimonial,
          { opacity: 1, y: 0, duration: 0.95, ease: "back.out(1.4)" },
          "-=0.35",
        );

      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          y: "+=20",
          duration: 5.5 + i * 0.65,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Scroll-linked depth on hero doctor image (scrub — follows scroll up/down)
      const imgWrap = root.querySelector<HTMLElement>("[data-hero='img-parallax']");
      const heroImg = imgWrap?.querySelector<HTMLImageElement>("img");
      if (imgWrap && heroImg) {
        gsap.fromTo(
          heroImg,
          { yPercent: 0, scale: 1 },
          {
            yPercent: 8,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (testimonialTilt) {
        gsap.fromTo(
          testimonialTilt,
          { y: 14, rotateZ: 0.5 },
          {
            y: -18,
            rotateZ: -0.5,
            ease: "none",
            scrollTrigger: {
              trigger: testimonialTilt,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.65,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [rootRef]);
}

