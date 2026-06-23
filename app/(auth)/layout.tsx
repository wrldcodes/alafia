// app/(auth)/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { asRoute } from "@/lib/routes";

export const metadata: Metadata = {
  title: {
    template: "%s | Aláfíà",
    default: "Aláfíà — Secure Access",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f4f0] dark:bg-[#0f0f0e] flex flex-col lg:flex-row">
      {/* Left panel — brand side (tablet + desktop) */}
      <aside className="hidden lg:flex lg:w-[42%] xl:w-[38%] lg:fixed lg:inset-y-0 lg:left-0 flex-col bg-[#0a3d2e] relative overflow-hidden flex-shrink-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
          <Link href="/" className="inline-flex no-underline">
            <Image
              src="/alafialogo-transparent.png"
              alt="Aláfíà logo"
              width={160}
              height={73}
              className="h-10 w-auto object-contain object-left brightness-0 invert"
              priority
            />
          </Link>

          <div className="flex-1 flex flex-col justify-center py-12">
            <p className="text-[11px] text-white/40 tracking-[.1em] uppercase mb-5">
              Aláfíà Health
            </p>
            <blockquote className="font-display text-[30px] xl:text-[34px] font-medium text-white leading-tight tracking-tight mb-8">
              {"Healthcare that reaches "}
              <span className="text-[#5DCAA5]">everyone.</span>
            </blockquote>

            <div className="flex gap-8">
              {[
                { value: "10k+", label: "Patients served" },
                { value: "500+", label: "Clinics registered" },
                { value: "99%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[20px] font-semibold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-white/40 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-white/10">
            <div className="flex">
              {["#1D9E75", "#378ADD", "#8B5CF6"].map((color, i) => (
                <div
                  key={color}
                  className="w-7 h-7 rounded-full border-2 border-white/20 text-[9px] font-semibold text-white flex items-center justify-center"
                  style={{ background: color, marginLeft: i > 0 ? -8 : 0 }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-white/50 leading-snug">
              Join thousands of patients and
              <br />
              clinics already on the platform
            </p>
          </div>
        </div>
      </aside>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[42%] xl:ml-[38%] relative z-10">
        <div className="lg:hidden flex items-center justify-between px-6 py-5 border-b border-[#e8e6e0] dark:border-[#2c2c2a]">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <Image
              src="/alafialogo-transparent.png"
              alt="Aláfíà logo"
              width={120}
              height={55}
              className="h-7 w-auto dark:brightness-0 dark:invert"
              priority
            />
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 py-10 lg:py-16 lg:px-12">
          <div className="w-full max-w-[400px] my-auto">{children}</div>
        </div>

        <div className="px-6 py-4 text-center border-t border-[#e8e6e0] dark:border-[#2c2c2a] mt-auto">
          <p className="text-[11px] text-[#c0bdb5] dark:text-[#555450]">
            © {new Date().getFullYear()} Aláfíà Health ·{" "}
            <Link
              href={asRoute("/support")}
              className="hover:text-[#0F6E56] no-underline transition-colors"
            >
              Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
