import {
  User,
  Calendar,
  Search,
  FileText,
  CreditCard,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollRevealSection } from "@/components/providers/ScrollRevealSection";

const features = [
  {
    icon: User,
    title: "Patient profiles",
    desc: "A complete, living record for every patient — history, prescriptions, notes, and contact details all in one clean view.",
  },
  {
    icon: Calendar,
    title: "Smart scheduling",
    desc: "Patients book their own appointments. Clinics manage their calendar. Automated reminders reduce no-shows for both sides.",
  },
  {
    icon: Search,
    title: "Clinic discovery",
    desc: "Community members can find verified clinics near them by service type, location, and availability.",
  },
  {
    icon: FileText,
    title: "Medical records",
    desc: "Clinics store records digitally. Patients can view their own health history. Secure, portable, and always accessible.",
  },
  {
    icon: CreditCard,
    title: "Billing & invoicing",
    desc: "Generate invoices, track payments, and monitor outstanding balances — all from the clinic dashboard.",
  },
  {
    icon: Shield,
    title: "Secure by design",
    desc: "Patient data is encrypted end-to-end. Role-based access means every staff member only sees what they should.",
  },
];

/**
 * Features — GSAP scroll pattern (same ideas as other landing sections):
 *
 * - TrustStrip: wrap trust chips in `data-stagger`; each chip `data-reveal="up"`.
 * - TwoAudiences: eyebrow `data-reveal="up"`, H2 `data-reveal="clip"`, cards `data-reveal="left"` / `"right"`.
 * - HowItWorks: intro lines `data-reveal="up"`, step grid `data-stagger` + each step `data-reveal="up"`.
 * - FinalCTA: H2 `data-reveal="clip"`, copy + buttons `data-reveal="up"`.
 * - Footer: stack `data-reveal="up"` on logo, links, copyright.
 *
 * Standout: `data-reveal="clip"` on headings — clip-path wipe (curtain), not a plain fade.
 */
export function Features() {
  return (
    <ScrollRevealSection
      className="max-w-[1100px] mx-auto px-13 py-25"
      id="features"
    >
      <div data-parallax="0.06" className="mb-14">
      <div
        data-reveal="up"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-600 tracking-[0.08em] uppercase mb-3.5"
      >
        What&apos;s included
      </div>
      <h2
        data-reveal="clip"
        className="font-display text-[clamp(30px,3.5vw,46px)] leading-[1.1] tracking-[-0.6px] text-teal-900 mb-3.5"
      >
        Everything in one place.
      </h2>
      <p
        data-reveal="up"
        className="text-[17px] font-light text-slate-400 leading-[1.75] max-w-[500px] mb-14"
      >
        A complete toolkit for modern clinics — and a simple, accessible
        experience for every patient.
      </p>
      </div>

      <div data-stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            data-reveal="scale"
            className={cn(
              "bg-white border border-sand-200 rounded-2xl p-8",
              "relative overflow-hidden group",
              "transition-all duration-250 hover:-translate-y-1",
              "hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-teal-100",
              'after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:h-0.5',
              "after:bg-teal-400 after:opacity-0 after:transition-opacity after:duration-250",
              "hover:after:opacity-100",
            )}
          >
            <div className="w-11 h-11 rounded-[12px] bg-teal-50 border border-teal-100 flex items-center justify-center mb-5">
              <Icon size={20} className="text-teal-600" />
            </div>
            <h3 className="font-display text-[19px] text-teal-900 mb-2.5">
              {title}
            </h3>
            <p className="text-[14px] font-light text-slate-400 leading-[1.75]">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </ScrollRevealSection>
  );
}
