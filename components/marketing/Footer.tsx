"use client";

import { ScrollRevealSection } from "@/components/providers/ScrollRevealSection";

export function Footer() {
  return (
    <ScrollRevealSection
      as="footer"
      className="border-t border-sand-200 px-13 py-11 grid grid-cols-1 md:grid-cols-3 items-center gap-6"
    >
      <p
        data-reveal="up"
        className="font-display text-[20px] text-teal-800"
      >
        Aláfíà
      </p>
      <ul
        data-reveal="up"
        className="flex gap-7 list-none justify-center"
      >
        {["For patients", "For clinics", "Privacy", "Contact"].map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-[13px] text-slate-400 no-underline transition-colors hover:text-teal-600"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
      <p
        data-reveal="up"
        className="text-[13px] font-light text-slate-400 md:text-right"
      >
        © 2025 Aláfíà. All rights reserved.
      </p>
    </ScrollRevealSection>
  );
}
