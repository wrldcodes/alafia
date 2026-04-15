"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Navbar — sticky top navigation with scroll-shadow effect.
 * Contains logo, page links, and dual sign-in / get-started CTAs.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-[200]",
        "flex items-center justify-between px-13 h-[70px]",
        "bg-sand-50/92 backdrop-blur-[16px]",
        "border-b border-sand-200 transition-shadow duration-300",
        scrolled && "shadow-[0_2px_24px_rgba(0,0,0,0.07)]",
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 font-display text-[22px] text-teal-800 no-underline"
      >
        <Image
          src="/alafialogo-transparent.png"
          alt="Aláfíà logo"
          width={1792}
          height={817}
          className="block h-[40px] w-auto"
        />
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none">
        {[
          { href: "#for-you", label: "For patients" },
          { href: "#for-clinics", label: "For clinics" },
          { href: "#features", label: "Features" },
        ].map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="text-sm font-light text-slate-600 no-underline transition-colors hover:text-teal-700"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2.5">
        <Button variant="outline" size="sm" asChild>
          <Link href="/home">Sign in</Link>
        </Button>
        <Button variant="linear" size="sm" asChild>
          <Link href="/enroll">Get started</Link>
        </Button>
      </div>
    </nav>
  );
}
