"use client";

// app/(auth)/login/page.tsx
// Uses react-hook-form + zodResolver for form state management.
// No manual useState per field — single useForm() handles everything.
// Zod schema validates on blur and submit, not every keystroke.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  User,
  Building2,
} from "lucide-react";
import {
  AuthCard,
  Field,
  AuthInput,
  AuthButton,
  ErrorBanner,
} from "@/components/auth/AuthCard";
import RoleCard from "@/components/auth/RoleCard";

// ── Zod schema ────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

type Role = "PATIENT" | "CLINIC";

const REDIRECTS: Record<string, string> = {
  SUPER_ADMIN: "/dashboard/admin",
  CLINIC_ADMIN: "/dashboard/clinic",
  CLINIC_STAFF: "/dashboard/staff",
  DOCTOR: "/dashboard/doctor",
  PATIENT: "/dashboard/patient",
};

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("PATIENT");
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setApiError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        setApiError(json.error ?? "Invalid email or password");
        return;
      }

      if (json.token) localStorage.setItem("alafia_token", json.token);
      if (json.user?.clinicId)
        localStorage.setItem("alafia_clinic_id", json.user.clinicId);

      router.push(REDIRECTS[json.user?.role] ?? "/dashboard");
      router.refresh();
    } catch {
      setApiError("Something went wrong. Please try again.");
    }
  }

  return (
    <AuthCard
      footer={
        <>
          New to Aláfíà?{" "}
          <Link
            href="/register?role=PATIENT"
            className="text-[#0F6E56] hover:underline"
          >
            Patient sign up
          </Link>
          {" · "}
          <Link
            href="/register?role=CLINIC"
            className="text-[#0F6E56] hover:underline"
          >
            Clinic sign up
          </Link>
        </>
      }
    >
      <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-1">
        Welcome back
      </h1>
      <p className="text-[12px] text-[#9a9890] dark:text-[#555450] mb-6 leading-relaxed">
        Sign in to your Aláfíà account to continue.
      </p>

      {/* Role selector */}
      <p className="text-[10px] font-semibold text-[#9a9890] tracking-[.07em] uppercase mb-2">
        Sign in as
      </p>
      <div className="grid grid-cols-2 gap-2 mb-5">
        <RoleCard
          icon={<User size={13} />}
          label="Patient"
          sub="Book & manage care"
          selected={role === "PATIENT"}
          onClick={() => setRole("PATIENT")}
        />
        <RoleCard
          icon={<Building2 size={13} />}
          label="Clinic / Doctor"
          sub="Manage your practice"
          selected={role === "CLINIC"}
          onClick={() => setRole("CLINIC")}
        />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[#e8e6e0] dark:bg-[#2c2c2a]" />
        <span className="text-[10px] text-[#c0bdb5] dark:text-[#3a3a38]">
          or sign in with email
        </span>
        <div className="flex-1 h-px bg-[#e8e6e0] dark:bg-[#2c2c2a]" />
      </div>

      {/* API-level error (wrong credentials etc.) */}
      <AnimatePresence>
        {apiError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <ErrorBanner message={apiError} />
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <Field
          label="Email address"
          hint={
            errors.email && (
              <p className="text-[10px] text-[#E24B4A]">
                {errors.email.message}
              </p>
            )
          }
        >
          <AuthInput
            {...register("email")}
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={13} />}
            error={!!errors.email}
            autoComplete="email"
          />
        </Field>

        {/* Password */}
        <Field
          label="Password"
          hint={
            errors.password ? (
              <p className="text-[10px] text-[#E24B4A]">
                {errors.password.message}
              </p>
            ) : (
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-[#0F6E56] hover:text-[#085041] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            )
          }
        >
          <AuthInput
            {...register("password")}
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            icon={<Lock size={13} />}
            error={!!errors.password}
            autoComplete="current-password"
            trailing={
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="hover:text-[#888] transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            }
          />
        </Field>

        <AuthButton loading={isSubmitting} className="mt-3">
          {isSubmitting ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in <ArrowRight size={13} />
            </>
          )}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
