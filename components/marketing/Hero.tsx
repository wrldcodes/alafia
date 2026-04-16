"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { TestimonialCard } from "./TestimonialCard";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";

/**
 * Hero — load animation via GSAP (useHeroAnimation): badge → headline + visual → subcopy → CTAs → testimonial (back.out).
 * Orbs float on a separate infinite tween.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="min-h-[calc(100vh-70px)] sm:min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-10 sm:gap-15 px-6 sm:px-13 pt-[90px] sm:pt-[110px] pb-14 sm:pb-20 relative overflow-hidden"
    >
      <div
        data-hero="orb"
        className="hero-orb hero-orb-1 absolute top-[-130px] right-[-180px] w-[min(120vw,700px)] h-[min(120vw,700px)] rounded-full bg-gradient-to-b from-teal-50 to-transparent pointer-events-none"
      />
      <div
        data-hero="orb"
        className="hero-orb hero-orb-2 absolute bottom-[-40px] left-[-90px] w-[min(95vw,420px)] h-[min(95vw,420px)] rounded-full bg-gradient-to-t from-earth-100 to-transparent pointer-events-none hidden sm:block"
      />

      <div className="relative z-10">
        <div
          data-hero="badge"
          className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-medium tracking-[0.08em] uppercase px-3.5 py-1 rounded-full mb-5 sm:mb-7"
        >
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
          Bridging communities to care
        </div>

        <h1
          data-hero="headline"
          className="font-display text-[clamp(34px,8vw,62px)] sm:text-[clamp(40px,4.5vw,62px)] leading-[1.1] tracking-[-1px] text-teal-900 mb-4 sm:mb-5"
        >
          Healthcare that reaches{" "}
          <em className="italic text-teal-600">everyone,</em>
          <br />
          everywhere.
        </h1>

        <p
          data-hero="subcopy"
          className="text-[15px] sm:text-[17px] font-light text-slate-400 leading-[1.7] sm:leading-[1.75] max-w-[460px] mb-8 sm:mb-11"
        >
          Aláfíà connects patients to clinics while giving healthcare providers
          the tools to serve more people, better.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <CTACard
            href="/enroll"
            variant="patient"
            label="For patients"
            title="Enroll as a community member"
            titleShort="Community enrollment"
            desc="Find clinics near you, book appointments, and access your health records."
            cta="Enroll free"
          />
          <CTACard
            href="/clinic/signup"
            variant="clinic"
            label="For clinics"
            title="Set up your clinic dashboard"
            titleShort="Clinic dashboard"
            desc="Manage patients, appointments, and records from one powerful workspace."
            cta="Start free"
          />
        </div>
      </div>

      <div
        data-hero="visual"
        className="hidden lg:flex flex-col items-end justify-end relative self-end translate-y-14 lg:translate-y-20"
      >
        <div
          data-hero="img-parallax"
          className="relative w-full max-w-[min(100%,640px)] overflow-visible rounded-[2rem]"
        >
          <Image
            src="/new-doctor-transparent.png"
            alt="Image of a doctor"
            loading="eager"
            width={720}
            height={400}
            className="block w-full h-auto will-change-transform"
            sizes="(max-width: 1024px) 0px, 640px"
          />
        </div>

        <div
          data-hero="testimonial"
          className="absolute bottom-6 right-0 w-[min(92%,340px)]"
        >
          <div data-hero="testimonial-tilt" className="will-change-transform">
            <TestimonialCard
              className="w-full"
              name="Amaka Obi"
              title="Community member"
              quote="Clear guidance, quick appointments, and so easy to use. It feels calm and personal."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface CTACardProps {
  href: string;
  variant: "patient" | "clinic";
  label: string;
  title: string;
  titleShort?: string;
  desc: string;
  cta: string;
}

function CTACard({
  href,
  variant,
  label,
  title,
  titleShort,
  desc,
  cta,
}: CTACardProps) {
  const isPatient = variant === "patient";
  return (
    <a
      data-hero="cta"
      href={href}
      className={[
        "rounded-2xl p-5 sm:p-6 flex flex-col gap-2 sm:gap-2.5 no-underline",
        "transition-all duration-200 hover:-translate-y-1",
        isPatient
          ? "bg-teal-700 shadow-[0_8px_32px_rgba(30,125,99,0.25)] hover:shadow-[0_14px_40px_rgba(30,125,99,0.35)]"
          : "bg-white border border-sand-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_10px_32px_rgba(0,0,0,0.1)] hover:border-teal-200",
      ].join(" ")}
    >
      <span
        className={`text-[10px] font-semibold tracking-[0.09em] uppercase ${isPatient ? "text-teal-200" : "text-slate-400"}`}
      >
        {label}
      </span>
      <p
        className={`font-display text-[16px] sm:text-[18px] leading-[1.2] ${isPatient ? "text-white" : "text-teal-900"}`}
      >
        <span className="sm:hidden">{titleShort ?? title}</span>
        <span className="hidden sm:inline">{title}</span>
      </p>
      <p
        className={`hidden sm:block text-[13px] font-light leading-[1.6] ${isPatient ? "text-white/70" : "text-slate-400"}`}
      >
        {desc}
      </p>
      <span
        className={`inline-flex items-center gap-1.5 text-[13px] font-medium mt-1.5 ${isPatient ? "text-white/90" : "text-teal-600"}`}
      >
        {cta} <ArrowRight size={13} />
      </span>
    </a>
  );
}
