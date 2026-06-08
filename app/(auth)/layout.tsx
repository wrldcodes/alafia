// app/(auth)/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    template: "%s | Aláfíà",
    default: "Aláfíà — Secure Access",
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col md:block">
      {/* Left panel — decorative brand side */}
      <div className="hidden md:flex md:w-[45%] lg:w-[42%] md:fixed md:inset-y-0 md:left-0 relative bg-teal-900 flex-col justify-between p-10 overflow-hidden z-0">
        {/* Background texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #3aab8a 0%, transparent 50%),
                              radial-gradient(circle at 80% 20%, #a887e9 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, #1e7d63 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 no-underline group">
            <Image
              src="/alafialogo-transparent.png"
              alt="Aláfíà logo"
              width={160}
              height={73}
              className="h-10 w-auto brightness-0 invert"
              priority
            />
          </Link>
        </div>

        {/* Center quote */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <blockquote className="space-y-4">
            <p className="font-display text-3xl lg:text-4xl text-white leading-snug italic">
              "Healthcare that reaches <span className="text-teal-400">everyone</span>."
            </p>
           
          </blockquote>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { value: "10k+", label: "Patients served" },
              { value: "500+", label: "Clinics registered" },
              { value: "99%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-teal-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote attribution */}
        <div className="relative z-10 flex items-center gap-3 border-t border-teal-700/50 pt-6">
          <div className="flex -space-x-2">
            {["bg-teal-400", "bg-emerald-500", "bg-purple-400"].map((color, i) => (
              <div key={i} className={`h-8 w-8 rounded-full ${color} border-2 border-teal-900 flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-white">{String.fromCharCode(65 + i)}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-teal-300 leading-snug">
            Join thousands of patients and clinics <br />already on the platform
          </p>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-[45%] lg:ml-[42%] relative z-10 bg-sand-50">
        {/* Mobile logo */}
        <div className="md:hidden flex items-center justify-between px-6 py-5 border-b border-sand-200">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <Image
              src="/alafialogo-transparent.png"
              alt="Aláfíà logo"
              width={120}
              height={55}
              className="h-7 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex flex-col px-6 py-12">
          <div className="w-full max-w-md mx-auto my-auto">
            {children}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="px-6 py-4 text-center border-t border-sand-200 mt-auto">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Aláfíà Health · <Link href="/support" className="hover:text-teal-600 no-underline">Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
