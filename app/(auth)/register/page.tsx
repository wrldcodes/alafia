"use client";

// app/(auth)/register/page.tsx
// Multi-step registration — step 1: role, step 2: details
// Single page, URL stays /register, content animates between steps

import { useState, Suspense } from "react";
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
} from "lucide-react";
import {
  AuthCard,
  LogoMark,
  StepDots,
  Field,
  AuthInput,
  AuthButton,
  ErrorBanner,
  StrengthBar,
} from "@/components/auth/AuthCard";
import RoleCard from "@/components/auth/RoleCard";

type Role = "PATIENT" | "CLINIC";

const SLIDE = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -40, opacity: 0 },
};

function RegisterPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(
    (searchParams.get("role") as Role) ?? "PATIENT",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  // Patient fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Clinic fields
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [license, setLicense] = useState("");

  function goToStep2() {
    setError("");
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body =
        role === "PATIENT"
          ? { role: "PATIENT", firstName, lastName, email, phone, password }
          : {
              role: "CLINIC_ADMIN",
              clinicName,
              address,
              licenseNumber: license,
              email,
              password,
            };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }

      // Auto-login after register
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      router.push(loginData.redirectTo ?? "/clinic");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <LogoMark />

      <AnimatePresence mode="wait">
        {/* ── Step 1 — choose role ──────────────────────── */}
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

            <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-1">
              Create an account
            </h1>
            <p className="text-[12px] text-[#9a9890] mb-6 leading-relaxed">
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

            <AuthButton onClick={goToStep2}>
              Continue <ArrowRight size={13} />
            </AuthButton>
          </motion.div>
        )}

        {/* ── Step 2 — fill details ─────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Back */}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
              }}
              className="flex items-center gap-1.5 text-[11px] text-[#9a9890] hover:text-[#1a1a18] transition-colors mb-4"
            >
              <ArrowLeft size={11} /> Back
            </button>

            <StepDots total={2} current={2} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-1">
              Your details
            </h1>

            {/* Role tag */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#E1F5EE] rounded-full text-[10px] font-medium text-[#0F6E56] mb-5">
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
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <ErrorBanner message={error} />
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
              {role === "PATIENT" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <Field id="register-first-name" label="First name">
                      <AuthInput
                        id="register-first-name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Amaka"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        icon={<User size={12} />}
                        required
                      />
                    </Field>
                    <Field id="register-last-name" label="Last name">
                      <AuthInput
                        id="register-last-name"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Obi"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        icon={<User size={12} />}
                        required
                      />
                    </Field>
                  </div>

                  <Field id="register-patient-email" label="Email address">
                    <AuthInput
                      id="register-patient-email"
                      type="email"
                      autoComplete="email"
                      placeholder="amaka@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail size={12} />}
                      required
                    />
                  </Field>

                  <Field id="register-patient-phone" label="Phone number">
                    <AuthInput
                      id="register-patient-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+234 801 234 5678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      icon={<Phone size={12} />}
                    />
                  </Field>

                  <Field
                    id="register-patient-password"
                    label="Password"
                    hint={<StrengthBar password={password} />}
                  >
                    <AuthInput
                      id="register-patient-password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock size={12} />}
                      required
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="text-[#c0bdb5] hover:text-[#888]"
                          aria-label={
                            showPw ? "Hide password" : "Show password"
                          }
                        >
                          {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      }
                    />
                  </Field>
                </>
              ) : (
                <>
                  <Field id="register-clinic-name" label="Clinic name">
                    <AuthInput
                      id="register-clinic-name"
                      type="text"
                      autoComplete="organization"
                      placeholder="Lagos Central Clinic"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      icon={<Building2 size={12} />}
                      required
                    />
                  </Field>

                  <Field id="register-clinic-email" label="Email address">
                    <AuthInput
                      id="register-clinic-email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@yourclinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<Mail size={12} />}
                      required
                    />
                  </Field>

                  <Field id="register-clinic-address" label="Address">
                    <AuthInput
                      id="register-clinic-address"
                      type="text"
                      autoComplete="street-address"
                      placeholder="123 Hospital Road, Lagos"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      icon={<FileText size={12} />}
                    />
                  </Field>

                  <Field id="register-license" label="License number">
                    <AuthInput
                      id="register-license"
                      type="text"
                      placeholder="LIC-2024-00123"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      icon={<FileText size={12} />}
                    />
                  </Field>

                  <Field
                    id="register-clinic-password"
                    label="Password"
                    hint={<StrengthBar password={password} />}
                  >
                    <AuthInput
                      id="register-clinic-password"
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock size={12} />}
                      required
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPw(!showPw)}
                          className="text-[#c0bdb5] hover:text-[#888]"
                          aria-label={
                            showPw ? "Hide password" : "Show password"
                          }
                        >
                          {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      }
                    />
                  </Field>
                </>
              )}

              <AuthButton loading={loading} className="mt-2">
                {loading ? (
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
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    }>
      <RegisterPageInner />
    </Suspense>
  );
}
