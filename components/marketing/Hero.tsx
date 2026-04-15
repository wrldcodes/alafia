import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import Image from "next/image";
import { TestimonialCard } from "./TestimonialCard";

/**
 * Hero — above-the-fold section with dual CTA cards for patients and clinics.
 * Left: headline + dual audience CTAs. Right: stacked live UI previews.
 */
export function Hero() {
  return (
    <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-15 px-13 pt-[110px] pb-20 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-120px] right-[-160px] w-[700px] h-[700px] rounded-full bg-gradient-to-b from-teal-50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-[-80px] w-[400px] h-[400px] rounded-full bg-gradient-to-t from-earth-100 to-transparent pointer-events-none" />

      {/* Left */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-medium tracking-[0.08em] uppercase px-3.5 py-1 rounded-full mb-7 animate-[fadeUp_0.6s_ease_0.1s_forwards] opacity-0">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />
          Bridging communities to care
        </div>

        <h1 className="font-display text-[clamp(40px,4.5vw,62px)] leading-[1.1] tracking-[-1px] text-teal-900 mb-5 animate-[fadeUp_0.7s_ease_0.25s_forwards] opacity-0">
          Healthcare that reaches{" "}
          <em className="italic text-teal-600">everyone,</em>
          <br />
          everywhere.
        </h1>

        <p className="text-[17px] font-light text-slate-400 leading-[1.75] max-w-[460px] mb-11 animate-[fadeUp_0.7s_ease_0.4s_forwards] opacity-0">
          Aláfíà connects patients to clinics while giving healthcare providers
          the tools to serve more people, better.
        </p>

        {/* Dual CTA cards */}
        <div className="grid grid-cols-2 gap-3.5 animate-[fadeUp_0.7s_ease_0.55s_forwards] opacity-0">
          <CTACard
            href="/enroll"
            variant="patient"
            label="For patients"
            title="Enroll as a community member"
            desc="Find clinics near you, book appointments, and access your health records."
            cta="Enroll free"
          />
          <CTACard
            href="/clinic/signup"
            variant="clinic"
            label="For clinics"
            title="Set up your clinic dashboard"
            desc="Manage patients, appointments, and records from one powerful workspace."
            cta="Start free"
          />
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-end justify-end relative self-end translate-y-14 lg:translate-y-20">
        <Image
          src="/new-doctor-transparent.png"
          alt="Image of a doctor"
          loading="eager"
          width={720}
          height={400}
          className="block w-full h-auto"
        />

        <TestimonialCard
          className="absolute bottom-6 right-0 w-[min(92%,340px)]"
          name="Amaka Obi"
          title="Community member"
          quote="Clear guidance, quick appointments, and so easy to use. It feels calm and personal."
        />
      </div>

      {/* Right: UI previews
      <div className="relative z-10 hidden lg:block animate-[fadeUp_0.8s_ease_0.65s_forwards] opacity-0">
        <HeroPreviews />
      </div> */}
    </section>
  );
}

interface CTACardProps {
  href: string;
  variant: "patient" | "clinic";
  label: string;
  title: string;
  desc: string;
  cta: string;
}

function CTACard({ href, variant, label, title, desc, cta }: CTACardProps) {
  const isPatient = variant === "patient";
  return (
    <a
      href={href}
      className={[
        "rounded-2xl p-6 flex flex-col gap-2.5 no-underline",
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
        className={`font-display text-[18px] leading-[1.2] ${isPatient ? "text-white" : "text-teal-900"}`}
      >
        {title}
      </p>
      <p
        className={`text-[13px] font-light leading-[1.6] ${isPatient ? "text-white/70" : "text-slate-400"}`}
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

function HeroPreviews() {
  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <Image
          src="/doctor.png"
          alt="Image of a doctor"
          width={720}
          height={400}
          className=""
        />
      </div>
      {/* Patient health card */}
      {/* <div className="bg-teal-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <span className="font-display text-[15px] text-teal-200">Aláfíà</span>
          <span className="bg-white/12 border border-white/20 text-white/80 text-[11px] font-medium px-2.5 py-0.5 rounded-full">Community member</span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-teal-600 flex items-center justify-center font-display text-[16px] text-white flex-shrink-0">AO</div>
          <div>
            <p className="text-[15px] font-medium">Amaka Obi</p>
            <p className="text-[12px] font-light text-white/50">ID: ALF-002849 · Enrolled 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {[['Visits','12'],['Clinic','Gbagada Health'],['Records','8']].map(([l,v]) => (
            <div key={l} className="bg-white/7 rounded-[10px] p-2.5">
              <p className="text-[10px] font-medium text-white/45 uppercase tracking-wide mb-1">{l}</p>
              <p className="font-display text-[18px] text-white leading-tight whitespace-pre-line text-[13px]">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3.5 pt-3.5 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-white/45 uppercase tracking-wide mb-1">Next appointment</p>
            <p className="text-[13px] text-white/85">Wed 2 Apr · 10:30am · Dr. Bello</p>
          </div>
          <span className="bg-teal-400 text-teal-900 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">Confirmed</span>
        </div>
      </div>

      {/* Clinic mini dashboard */}
      {/* <div className="bg-white border border-sand-200 rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
        <div className="bg-sand-50 border-b border-sand-200 px-4 py-3 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbfbf]"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffd98a]"/>
          <span className="w-2.5 h-2.5 rounded-full bg-[#a3dece]"/>
          <span className="flex-1 bg-white border border-sand-200 rounded-md px-3 py-1 text-[11px] text-slate-400 mx-2.5">app.alafi.health/dashboard</span>
        </div>
        <div className="flex" style={{minHeight:'200px'}}>
          <div className="w-[140px] bg-teal-900 p-4 flex flex-col gap-1.5 flex-shrink-0">
            <p className="font-display text-[13px] text-teal-200 pb-3 border-b border-white/8 mb-1">Aláfíà</p>
            {['Dashboard','Patients','Appointments','Billing'].map((item,i) => (
              <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] ${i===0 ? 'bg-white/10 text-white' : 'text-white/45'}`}>{item}</div>
            ))}
          </div>
          <div className="flex-1 bg-sand-50 p-4">
            <p className="font-display text-[14px] text-teal-900 mb-3">Good morning, Dr. Adeyemi 👋</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[['Patients','1,284','↑ 12'],['Today','18','3 pending'],['Invoices','₦420k','7 unpaid']].map(([l,v,d]) => (
                <div key={l} className="bg-white border border-sand-200 rounded-[10px] p-2.5">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide mb-1">{l}</p>
                  <p className="font-display text-[18px] text-teal-800 leading-none">{v}</p>
                  <p className="text-[10px] text-teal-400 mt-0.5">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
