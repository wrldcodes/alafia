import { Shield, Clock, Users, Smartphone, Wifi } from "lucide-react";
import { ScrollRevealSection } from "@/components/providers/ScrollRevealSection";

const items = [
  { icon: Shield, label: "Secure patient data" },
  { icon: Clock, label: "Setup in under 10 minutes" },
  { icon: Users, label: "200+ clinics onboarded" },
  { icon: Wifi, label: "Low-data friendly" },
  { icon: Smartphone, label: "Works on any device" },
];

/**
 * TrustStrip — staggered row of chips (`data-stagger` + each `data-reveal="up"`).
 */
export function TrustStrip() {
  return (
    <ScrollRevealSection className="px-13 py-5 bg-white border-y border-sand-200">
      <div data-parallax="0.05" className="w-full">
      <div
        data-stagger
        className="flex items-center justify-center flex-wrap gap-10"
      >
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            data-reveal="up"
            className="flex items-center gap-2.5 text-[13px] font-light text-slate-400"
          >
            <Icon size={16} className="text-teal-400 flex-shrink-0" />
            {label}
          </div>
        ))}
      </div>
      </div>
    </ScrollRevealSection>
  );
}
