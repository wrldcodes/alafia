"use client";

// app/(auth)/register/page.tsx
// Multi-step registration with react-hook-form + zodResolver.
// Step 1: role selection (no form fields — just a state toggle).
// Step 2: role-specific fields validated by Zod before submit.
// On success: auto-login then redirect to dashboard.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  FileText,
  MapPin,
} from "lucide-react";
import {
  AuthCard,
  StepDots,
  Field,
  AuthInput,
  AuthButton,
  ErrorBanner,
  StrengthBar,
} from "@/components/auth/AuthCard";
import RoleCard from "@/components/auth/RoleCard";

type Role = "PATIENT" | "CLINIC";

// ── Zod schemas ───────────────────────────────────────────────────────────

const patientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

const clinicSchema = z.object({
  clinicName: z.string().min(2, "Clinic name is required"),
  email: z.string().email("Enter a valid email"),
  address: z.string().optional(),
  license: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});

type PatientForm = z.infer<typeof patientSchema>;
type ClinicForm = z.infer<typeof clinicSchema>;

// ── Animation ─────────────────────────────────────────────────────────────
const SLIDE = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(
    (searchParams.get("role") as Role) ?? "PATIENT",
  );
  const [showPw, setShowPw] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Patient form ──────────────────────────────────────────────────────
  const patientForm = useForm<PatientForm>({
    resolver: zodResolver(patientSchema),
    mode: "onBlur", // validate on blur, not every keystroke
  });

  // ── Clinic form ───────────────────────────────────────────────────────
  const clinicForm = useForm<ClinicForm>({
    resolver: zodResolver(clinicSchema),
    mode: "onBlur",
  });

  const patientPassword = patientForm.watch("password") ?? "";
  const clinicPassword = clinicForm.watch("password") ?? "";

  // ── Submit handler ────────────────────────────────────────────────────
  async function onPatientSubmit(data: PatientForm) {
    setApiError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "PATIENT", ...data }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? "Registration failed.");
        return;
      }
      await autoLogin(data.email, data.password);
    } catch {
      setApiError("Something went wrong. Please try again.");
    }
  }

  async function onClinicSubmit(data: ClinicForm) {
    setApiError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "CLINIC_ADMIN",
          clinicName: data.clinicName,
          email: data.email,
          address: data.address,
          licenseNumber: data.license,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json.error ?? "Registration failed.");
        return;
      }
      await autoLogin(data.email, data.password);
    } catch {
      setApiError("Something went wrong. Please try again.");
    }
  }

  async function autoLogin(email: string, password: string) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (json.token) localStorage.setItem("alafia_token", json.token);
    if (json.user?.clinicId)
      localStorage.setItem("alafia_clinic_id", json.user.clinicId);
    router.push(json.redirectTo ?? "/dashboard");
    router.refresh();
  }

  // ── Error helper ──────────────────────────────────────────────────────
  function err(msg: string | undefined) {
    return msg ? (
      <p className="text-[10px] text-[#E24B4A] mt-1">{msg}</p>
    ) : null;
  }

  return (
    <AuthCard
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-[#0F6E56] hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait">
        {/* ── Step 1 — role selection ───────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <StepDots total={2} current={1} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-1">
              Create an account
            </h1>
            <p className="text-[12px] text-[#9a9890] dark:text-[#555450] mb-6 leading-relaxed">
              Choose how you want to use Aláfíà.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <RoleCard
                icon={<User size={13} />}
                label="Patient"
                sub="Book & manage care"
                selected={role === "PATIENT"}
                onClick={() => setRole("PATIENT")}
              />
              <RoleCard
                icon={<Building2 size={13} />}
                label="Clinic / Practice"
                sub="Manage your practice"
                selected={role === "CLINIC"}
                onClick={() => setRole("CLINIC")}
              />
            </div>

            <AuthButton
              type="button"
              onClick={() => {
                setApiError("");
                setStep(2);
              }}
            >
              Continue <ArrowRight size={13} />
            </AuthButton>
          </motion.div>
        )}

        {/* ── Step 2 — details form ─────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setApiError("");
              }}
              className="flex items-center gap-1.5 text-[11px] text-[#9a9890] hover:text-[#1a1a18] dark:hover:text-[#f0ede8] transition-colors mb-4"
            >
              <ArrowLeft size={11} /> Back
            </button>

            <StepDots total={2} current={2} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-1">
              Your details
            </h1>

            {/* Role tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E1F5EE] dark:bg-[#0F3028] rounded-full text-[10px] font-medium text-[#0F6E56] mb-5">
              {role === "PATIENT" ? (
                <>
                  <User size={10} />
                  Registering as Patient
                </>
              ) : (
                <>
                  <Building2 size={10} />
                  Registering as Clinic
                </>
              )}
            </div>

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

            {/* ── Patient fields ──────────────────────── */}
            {role === "PATIENT" && (
              <form
                onSubmit={patientForm.handleSubmit(onPatientSubmit)}
                noValidate
              >
                <div className="grid grid-cols-2 gap-2">
                  <Field
                    label="First name"
                    hint={err(patientForm.formState.errors.firstName?.message)}
                  >
                    <AuthInput
                      {...patientForm.register("firstName")}
                      type="text"
                      placeholder="Amaka"
                      icon={<User size={12} />}
                      error={!!patientForm.formState.errors.firstName}
                      autoComplete="given-name"
                    />
                  </Field>
                  <Field
                    label="Last name"
                    hint={err(patientForm.formState.errors.lastName?.message)}
                  >
                    <AuthInput
                      {...patientForm.register("lastName")}
                      type="text"
                      placeholder="Obi"
                      icon={<User size={12} />}
                      error={!!patientForm.formState.errors.lastName}
                      autoComplete="family-name"
                    />
                  </Field>
                </div>

                <Field
                  label="Email address"
                  hint={err(patientForm.formState.errors.email?.message)}
                >
                  <AuthInput
                    {...patientForm.register("email")}
                    type="email"
                    placeholder="amaka@gmail.com"
                    icon={<Mail size={12} />}
                    error={!!patientForm.formState.errors.email}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Phone number">
                  <AuthInput
                    {...patientForm.register("phone")}
                    type="tel"
                    placeholder="+234 801 234 5678"
                    icon={<Phone size={12} />}
                    autoComplete="tel"
                  />
                </Field>

                <Field
                  label="Password"
                  hint={
                    patientForm.formState.errors.password ? (
                      err(patientForm.formState.errors.password.message)
                    ) : (
                      <StrengthBar password={patientPassword} />
                    )
                  }
                >
                  <AuthInput
                    {...patientForm.register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    icon={<Lock size={12} />}
                    error={!!patientForm.formState.errors.password}
                    autoComplete="new-password"
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        aria-label={showPw ? "Hide" : "Show"}
                      >
                        {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    }
                  />
                </Field>

                <AuthButton
                  loading={patientForm.formState.isSubmitting}
                  className="mt-2"
                >
                  {patientForm.formState.isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight size={13} />
                    </>
                  )}
                </AuthButton>
              </form>
            )}

            {/* ── Clinic fields ───────────────────────── */}
            {role === "CLINIC" && (
              <form
                onSubmit={clinicForm.handleSubmit(onClinicSubmit)}
                noValidate
              >
                <Field
                  label="Clinic name"
                  hint={err(clinicForm.formState.errors.clinicName?.message)}
                >
                  <AuthInput
                    {...clinicForm.register("clinicName")}
                    type="text"
                    placeholder="Lagos Central Clinic"
                    icon={<Building2 size={12} />}
                    error={!!clinicForm.formState.errors.clinicName}
                    autoComplete="organization"
                  />
                </Field>

                <Field
                  label="Email address"
                  hint={err(clinicForm.formState.errors.email?.message)}
                >
                  <AuthInput
                    {...clinicForm.register("email")}
                    type="email"
                    placeholder="admin@yourclinic.com"
                    icon={<Mail size={12} />}
                    error={!!clinicForm.formState.errors.email}
                    autoComplete="email"
                  />
                </Field>

                <Field label="Address">
                  <AuthInput
                    {...clinicForm.register("address")}
                    type="text"
                    placeholder="123 Hospital Road, Lagos"
                    icon={<MapPin size={12} />}
                    autoComplete="street-address"
                  />
                </Field>

                <Field label="License number">
                  <AuthInput
                    {...clinicForm.register("license")}
                    type="text"
                    placeholder="LIC-2024-00123"
                    icon={<FileText size={12} />}
                  />
                </Field>

                <Field
                  label="Password"
                  hint={
                    clinicForm.formState.errors.password ? (
                      err(clinicForm.formState.errors.password.message)
                    ) : (
                      <StrengthBar password={clinicPassword} />
                    )
                  }
                >
                  <AuthInput
                    {...clinicForm.register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    icon={<Lock size={12} />}
                    error={!!clinicForm.formState.errors.password}
                    autoComplete="new-password"
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        aria-label={showPw ? "Hide" : "Show"}
                      >
                        {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    }
                  />
                </Field>

                <AuthButton
                  loading={clinicForm.formState.isSubmitting}
                  className="mt-2"
                >
                  {clinicForm.formState.isSubmitting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create account <ArrowRight size={13} />
                    </>
                  )}
                </AuthButton>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  );
}
