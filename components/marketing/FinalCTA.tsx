"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * FinalCTA — dark teal banner with dual patient/clinic CTAs.
 * Animates in with scroll reveal effect.
 */
export function FinalCTA() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className=" mb-16 sm:mb-25 bg-teal-800 px-6 sm:px-10 lg:px-18 py-12 sm:py-20  items-center gap-8 sm:gap-12 relative overflow-hidden"
    >
      <div className="absolute top-[-100px] right-[-80px] w-[460px] h-[460px] rounded-full bg-[radial-gradient(ellipse,rgba(58,171,138,0.2)_0%,transparent_70%)]" />
      <div className="relative z-10">
        <h2 className="reveal font-display text-[clamp(28px,3vw,42px)] leading-[1.15] text-white mb-3 tracking-[-0.5px]">
          Better healthcare starts with better access.
        </h2>
        <p className="reveal text-[15px] sm:text-[16px] font-light text-white/50 leading-[1.7]">
          Join Aláfíà as a patient or a clinic.
          <br />
          Free to start. No credit card needed.
        </p>
      </div>
      <div className="mt-auto pt-6 sm:pt-0 sm:mt-12 grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-[760px] relative z-10 flex-shrink-0">
        <a
          href="/enroll"
          className="reveal inline-flex items-center justify-center px-7.5 py-3.5 rounded bg-white text-teal-800 text-[14px] font-semibold no-underline transition-all hover:bg-teal-50 hover:-translate-y-px whitespace-nowrap"
        >
          Enroll as a patient
        </a>
        <a
          href="/clinic/signup"
          className="reveal inline-flex items-center justify-center px-7.5 py-3.5 rounded bg-transparent text-white/80 text-[14px] font-medium border border-white/20 no-underline transition-all hover:border-white/50 hover:text-white whitespace-nowrap"
        >
          Set up a clinic
        </a>
      </div>
    </div>
  );
}
