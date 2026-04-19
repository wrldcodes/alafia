"use client";
import { useState } from "react";
import {
  Clock,
  UserPlus,
  Search,
  CalendarCheck,
  Building2,
  Users,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollRevealSection } from "@/components/providers/ScrollRevealSection";

type Audience = "patient" | "clinic";

interface Step {
  num: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const patientSteps: Step[] = [
  {
    num: "01",
    icon: <UserPlus size={20} />,
    title: "Create your profile",
    desc: "Enter your name, phone number, and location. No long forms, no documents needed to start.",
  },
  {
    num: "02",
    icon: <Search size={20} />,
    title: "Find a clinic near you",
    desc: "Browse verified clinics in your area. See their services, available doctors, and opening hours.",
  },
  {
    num: "03",
    icon: <CalendarCheck size={20} />,
    title: "Book & show up",
    desc: "Pick a date and time that works for you. Get a reminder before your appointment.",
  },
];

const clinicSteps: Step[] = [
  {
    num: "01",
    icon: <Building2 size={20} />,
    title: "Register your clinic",
    desc: "Add your clinic details, services, and operating hours. You'll be visible to patients immediately.",
  },
  {
    num: "02",
    icon: <Users size={20} />,
    title: "Invite your team",
    desc: "Add doctors, nurses, and admin staff with specific roles and permissions.",
  },
  {
    num: "03",
    icon: <BarChart3 size={20} />,
    title: "Start managing care",
    desc: "Manage appointments, records, billing, and daily operations from your dashboard.",
  },
];

/**
 * HowItWorks — tabbed section showing 3-step flows for patients and clinics.
 */
export function HowItWorks() {
  const [tab, setTab] = useState<Audience>("patient");

  const steps = tab === "patient" ? patientSteps : clinicSteps;

  return (
    <ScrollRevealSection
      className="bg-teal-900 py-16 sm:py-25 px-6 sm:px-13"
      id="how"
    >
      <div className="max-w-[1100px] mx-auto">
        <div
          data-reveal="up"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-200 tracking-[0.08em] uppercase mb-3.5"
        >
          <Clock size={13} /> Step by step
        </div>
        <h2
          data-reveal="up"
          className="font-display text-[clamp(30px,3.5vw,46px)] leading-[1.1] tracking-[-0.6px] text-white mb-3.5"
        >
          Simple for everyone.
        </h2>
        <p
          data-reveal="up"
          className="text-[15px] sm:text-[17px] font-light text-white/50 leading-[1.7] sm:leading-[1.75] max-w-[480px] mb-8 sm:mb-10"
        >
          No tech experience needed. If you can send a text message, you can use
          Aláfíà.
        </p>

        {/* Tab switcher */}
        <div data-reveal="up" className="flex flex-wrap gap-2.5 mb-9 sm:mb-12">
          {(["patient", "clinic"] as Audience[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5.5 py-2 rounded-full text-[14px] font-medium border transition-all duration-200 cursor-pointer",
                tab === t
                  ? "bg-teal-400 text-teal-900 border-teal-400"
                  : "bg-transparent text-white/50 border-white/15 hover:border-white/30 hover:text-white/80",
              )}
            >
              {t === "patient" ? "For patients" : "For clinics"}
            </button>
          ))}
        </div>

        <div
          data-stagger
          className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-0.5"
        >
          {steps.map((step) => (
            <div
              key={step.num}
              data-reveal="up"
              className="bg-white/4 rounded-2xl p-6 sm:p-9"
            >
              <div className="font-display text-[40px] sm:text-[48px] font-semibold leading-none mb-3 sm:mb-4 text-linear-accent">
                {step.num}
              </div>
              <div className="w-11 h-11 rounded-[12px] bg-white/8 flex items-center justify-center mb-5 text-[#6ecfb3]">
                {step.icon}
              </div>
              <h3 className="font-display text-[19px] text-white mb-2.5">
                {step.title}
              </h3>
              <p className="text-[14px] font-light text-white/50 leading-[1.75]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ScrollRevealSection>
  );
}
