"use client";
import { useLayoutEffect, useState, type MouseEvent } from "react";
import { ArrowUpRight, CircleX, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button as UIButton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { asRoute } from "@/lib/routes";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "motion/react";

const NAV_ITEMS = [
  { label: "For Patients", href: "#for-you" },
  { label: "For Clinics", href: "#for-clinics" },
  { label: "Features", href: "#features" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useLayoutEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleHashClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith("#") || href === "#") return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1)) as HTMLElement | null;
    if (!target) return;
    setIsOpen(false);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || !lenis) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      lenis.scrollTo(target, { offset: -70 });
    }
  }

  return (
    <>
      {/* ── Main bar ── */}
      <nav
        className={cn(
          // FIX: was `relative` — that broke `fixed`
          "fixed inset-x-0 top-0 z-[220]",
          "flex items-center justify-between h-[70px] px-6 md:px-10",
          "transition-colors duration-300",
          scrolled ? " backdrop-blur-md text-black " : "bg-transparent ",
          "transition-shadow duration-300",
          scrolled && "shadow-[0_2px_24px_rgba(0,0,0,0.07)]",
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <Image
            src="/alafialogo-transparent.png"
            alt="Aláfíà logo"
            width={1792}
            height={817}
            className="h-9 w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex ml-auto gap-8 list-none m-0 p-0 lg:mr-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={(e) => handleHashClick(e, href)}
                className={cn(
                  "relative text-sm font-medium no-underline transition-colors",
                  scrolled
                    ? "text-slate-700 hover:text-teal-700"
                    : "text-sand-50 hover:text-white",
                  // underline slide-in on hover
                  "after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0",
                  "after:bg-teal-600 after:transition-[width] after:duration-300",
                  "hover:after:w-full",
                )}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden lg:flex items-center gap-3">
          <UIButton variant="outline" size="md" asChild>
            <Link href={asRoute("/login")}>Sign in</Link>
          </UIButton>
          <UIButton variant="linear" size="md" asChild>
            <Link href={asRoute("/register")}>Get started</Link>
          </UIButton>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "md:hidden z-[230] flex items-center justify-center w-10 h-10",
            isOpen ? "text-white" : scrolled ? "text-teal-800" : "text-sand-50",
          )}
        >
          {isOpen ? <CircleX size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* ── Mobile full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[190] md:hidden",
              "bg-teal-800 flex flex-col px-6 pt-[70px] pb-10",
            )}
          >
            {/* Nav links */}
            <ul className="flex flex-col gap-1 mt-10 list-none m-0 p-0">
              {NAV_ITEMS.map(({ href, label }, i) => (
                <motion.li
                  key={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
                >
                  <a
                    href={href}
                    onClick={(e) => handleHashClick(e, href)}
                    className={cn(
                      "flex items-center justify-between py-4",
                      "border-b border-teal-700",
                      "text-2xl font-light text-white no-underline",
                      "transition-opacity hover:opacity-70",
                    )}
                  >
                    {label}
                    <ArrowUpRight className="w-5 h-5 opacity-50" />
                  </a>
                </motion.li>
              ))}
            </ul>

            {/* CTA at bottom */}
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Link
                href={asRoute("/register")}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center justify-between w-full px-6 py-4",
                  "text-base font-medium text-teal-800 bg-white",
                  "transition-opacity hover:opacity-90 no-underline",
                )}
              >
                Get Started
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
