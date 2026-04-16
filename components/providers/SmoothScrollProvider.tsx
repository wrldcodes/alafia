"use client";

import {
  useEffect,
  useState,
  useRef,
  ReactNode,
  createContext,
  useContext,
} from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Lenis is stepped from GSAP's ticker (no separate RAF loop).
 * `lenis.on("scroll", ScrollTrigger.update)` keeps ScrollTrigger in sync.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const tickerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (cancelled) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const nextLenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1 - Math.pow(1 - t, 3)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.45,
      });

      lenisRef.current = nextLenis;
      nextLenis.on("scroll", ScrollTrigger.update);

      const tick = () => {
        nextLenis.raf(performance.now());
      };
      tickerRef.current = tick;
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      if (cancelled) {
        gsap.ticker.remove(tick);
        tickerRef.current = null;
        nextLenis.destroy();
        lenisRef.current = null;
        return;
      }

      setLenis(nextLenis);
    })();

    return () => {
      cancelled = true;
      void (async () => {
        const { gsap } = await import("gsap");
        const tick = tickerRef.current;
        if (tick) {
          gsap.ticker.remove(tick);
          tickerRef.current = null;
        }
        lenisRef.current?.destroy();
        lenisRef.current = null;
        setLenis(null);
      })();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
