"use client";

import { useRef } from "react";
import { ArrowRight, Check, User, Building2 } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

/**
 * TwoAudiences — "One platform. Two sides of care." section with
 * patient (dark) and clinic (light) cards side by side.
 * Cards animate smoothly as you scroll with parallax effect.
 */
export function TwoAudiences() {
  const ref = useGsapReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="max-w-[1100px] mx-auto px-6 sm:px-13 py-16 sm:py-25"
      id="for-you"
    >
      <div className="mb-10 sm:mb-14">
        <SectionTag
          data-reveal="up"
          icon={<User size={13} />}
          label="Built for two"
        />
        <h2
          data-reveal="up"
          className="font-display text-[clamp(30px,3.5vw,46px)] leading-[1.1] tracking-[-0.6px] text-teal-900 mb-3.5"
        >
          One platform.
          <br />
          Two sides of care.
        </h2>
        <p
          data-reveal="up"
          className="text-[17px] font-light text-slate-400 leading-[1.75] max-w-[500px]"
        >
          Whether you're a patient in a rural community or a clinic serving
          hundreds — Aláfíà was built with you in mind.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        <AudienceCard
          dataReveal="left"
          variant="community"
          who="For community members"
          title="Your health, in your hands."
          desc="No matter where you live — town, village, or city outskirts — you deserve access to quality healthcare. Aláfíà makes it simple to enroll, find a clinic, and manage your health."
          benefits={[
            "Find verified clinics near your location",
            "Book appointments without phone calls",
            "View your own medical history anytime",
            "Receive health tips and appointment reminders",
          ]}
          ctaLabel="Enroll as a patient"
          ctaHref="/enroll"
        />
        <AudienceCard
          dataReveal="right"
          variant="clinic"
          who="For clinics & healthcare providers"
          title="Run your clinic with clarity."
          desc="From a busy urban practice to a rural health post — Aláfíà gives your team the tools to manage patients efficiently, reduce paperwork, and focus on what matters: care."
          benefits={[
            "Full patient and appointment management",
            "Digital medical records and notes",
            "Invoicing and billing in one dashboard",
            "Role-based access for your entire team",
          ]}
          ctaLabel="Set up your clinic"
          ctaHref="/clinic/signup"
        />
      </div>
    </div>
  );
}

interface AudienceCardProps {
  dataReveal?: string;
  variant: "community" | "clinic";
  who: string;
  title: string;
  desc: string;
  benefits: string[];
  ctaLabel: string;
  ctaHref: string;
}

function AudienceCard({
  dataReveal,
  variant,
  who,
  title,
  desc,
  benefits,
  ctaLabel,
  ctaHref,
}: AudienceCardProps) {
  const isCommunity = variant === "community";
  return (
    <div
      data-reveal={dataReveal}
      className={[
        "flex flex-col rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-11 relative overflow-hidden",
        isCommunity ? "bg-[rgb(20,88,72)] text-white" : "bg-[rgb(245,240,232)]",
      ].join(" ")}
    >
      <p
        className={`text-[11px] font-semibold tracking-[0.09em] uppercase mb-2.5 ${isCommunity ? "text-teal-200" : "text-earth-600"}`}
      >
        {who}
      </p>
      <h3
        className={`font-display text-[26px] leading-[1.2] mb-3.5 ${isCommunity ? "text-white" : "text-teal-900"}`}
      >
        {title}
      </h3>
      <p
        className={`text-[15px] font-light leading-[1.75] mb-7 ${isCommunity ? "text-white/65" : "text-slate-600"}`}
      >
        {desc}
      </p>
      <ul className="flex flex-col gap-2.5 mb-8 list-none">
        {benefits.map((b) => (
          <li key={b} className="flex items-start gap-2.5">
            <span
              className={`w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCommunity ? "bg-white/15" : "bg-earth-100"}`}
            >
              <Check
                size={9}
                strokeWidth={3}
                className={isCommunity ? "text-teal-200" : "text-earth-600"}
              />
            </span>
            <span
              className={`text-[14px] font-light ${isCommunity ? "text-white/80" : "text-slate-600"}`}
            >
              {b}
            </span>
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        className={[
          "inline-flex items-center gap-2 px-6.5 py-3 rounded-full text-[14px] font-medium no-underline transition-all duration-200 hover:-translate-y-0.5",
          isCommunity
            ? "bg-white text-teal-800 shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
            : "bg-teal-700 text-white shadow-[0_4px_16px_rgba(30,125,99,0.25)] hover:shadow-[0_8px_24px_rgba(30,125,99,0.35)]",
        ].join(" ")}
      >
        {ctaLabel} <ArrowRight size={14} />
      </a>
    </div>
  );
}

function SectionTag({
  icon,
  label,
  dataReveal,
}: {
  icon: React.ReactNode;
  label: string;
  dataReveal?: string;
}) {
  return (
    <div
      data-reveal={dataReveal}
      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-600 tracking-[0.08em] uppercase mb-3.5"
    >
      {icon}
      {label}
    </div>
  );
}
