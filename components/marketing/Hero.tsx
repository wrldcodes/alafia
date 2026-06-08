"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="min-h-[calc(100vh-70px)] sm:min-h-screen flex items-center justify-center px-6 sm:px-13 pt-[104px] sm:pt-[110px] pb-10 sm:pb-20 relative overflow-hidden"
    >
      <div className="relative z-10 w-full max-w-[900px] min-h-[68svh] sm:min-h-0 flex flex-col items-center text-center">
        <h1
          data-hero="headline"
          className="font-display text-[clamp(36px,9vw,78px)] leading-[1.1] tracking-[-1px] text-white mb-4 sm:mb-5"
        >
          Healthcare that reaches <br className="hidden sm:block" />
          <em className="italic text-teal-600">everyone</em>.
        </h1>

        <p
          data-hero="subcopy"
          className="text-[17px] sm:text-[20px] font-light text-sand-50 leading-[1.7] sm:leading-[1.75] w-full max-w-[700px] mb-8 sm:mb-11"
        >
          Alafia connects patients to clinics while giving healthcare providers
          the tools to serve more people, better.
        </p>

        <div className="mt-auto pt-6 sm:pt-0 sm:mt-12 grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full max-w-[760px]">
          <CTACard
            href="/register"
            variant="patient"
            title="Book care near you"
            cta="Enroll free"
          />
          <CTACard
            href="/register?role=clinic"
            variant="clinic"
            title="Run your clinic smoothly"
            cta="Start free"
          />
        </div>
      </div>
    </section>
  );
}

interface CTACardProps {
  href: string;
  variant: "patient" | "clinic";
  title: string;
  cta: string;
}

function CTACard({ href, variant, title, cta }: CTACardProps) {
  const isPatient = variant === "patient";

  return (
    <a
      data-hero="cta"
      href={href}
      className={[
        "rounded-2xl p-4 sm:p-6 w-full min-w-0 flex flex-col items-start text-left gap-2.5 sm:gap-3 no-underline",
        "transition-all duration-200 hover:-translate-y-1",
        isPatient
          ? "bg-transparent border border-white/35 shadow-[0_8px_32px_rgba(0,0,0,0.18)] hover:shadow-[0_14px_40px_rgba(0,0,0,0.24)]"
          : "bg-white border border-sand-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.1)] hover:border-teal-200",
      ].join(" ")}
    >
      <p
        className={`font-display text-[15px] sm:text-[18px] leading-[1.3] ${isPatient ? "text-white" : "text-teal-900"}`}
      >
        {title}
      </p>
      <span
        className={`inline-flex items-center gap-1.5 text-[13px] font-medium ${isPatient ? "text-white/90" : "text-teal-600"}`}
      >
        {cta} <ArrowRight size={13} />
      </span>
    </a>
  );
}
