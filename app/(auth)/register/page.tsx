"use client";

// app/(auth)/register/page.tsx
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  Calendar,
  MapPin,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "PATIENT" | "CLINIC_ADMIN" | null;
type Step = 1 | 2;
type Status = "idle" | "loading" | "error" | "success";

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  rightElement,
  disabled,
  optional,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ElementType;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  optional?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 text-xs font-light text-slate-400">(optional)</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            "w-full py-3 text-sm text-slate-800 bg-white",
            "border rounded-xl transition-all duration-200 outline-none",
            "placeholder:text-slate-300",
            "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            Icon ? "pl-10" : "pl-4",
            rightElement ? "pr-11" : "pr-4",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
              : "border-slate-200 hover:border-slate-300",
          )}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                done
                  ? "bg-teal-600 text-white"
                  : active
                  ? "bg-teal-700 text-white ring-2 ring-teal-200"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              {done ? <Check size={12} /> : step}
            </div>
            {i < total - 1 && (
              <div className={cn("h-px w-8 transition-all", done ? "bg-teal-400" : "bg-slate-200")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Role selection card ──────────────────────────────────────────────────────
function RolePicker({
  selected,
  onSelect,
}: {
  selected: Role;
  onSelect: (r: Role) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {[
        {
          role: "PATIENT" as const,
          label: "Patient",
          tagline: "Book & manage your healthcare",
          icon: User,
          color: "#1e7d63",
          features: ["Find nearby clinics", "Book appointments", "View your records", "Free to join"],
        },
        {
          role: "CLINIC_ADMIN" as const,
          label: "Clinic / Practice",
          tagline: "Manage your healthcare practice",
          icon: Building2,
          color: "#6366f1",
          features: ["Manage appointments", "Patient records", "Staff management", "Analytics dashboard"],
        },
      ].map(({ role, label, tagline, icon: Icon, color, features }) => (
        <button
          key={role}
          type="button"
          onClick={() => onSelect(role)}
          className={cn(
            "flex flex-col items-start gap-3 p-5 rounded-2xl border text-left transition-all duration-200",
            selected === role
              ? "border-2 shadow-sm"
              : "border border-slate-200 bg-white hover:border-slate-300",
          )}
          style={
            selected === role
              ? {
                  borderColor: color,
                  backgroundColor: `${color}08`,
                }
              : undefined
          }
        >
          {/* Icon + radio */}
          <div className="flex w-full items-center justify-between">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${color}18`, color }}
            >
              <Icon size={20} />
            </div>
            <div
              className="h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all"
              style={
                selected === role
                  ? { borderColor: color, backgroundColor: color }
                  : { borderColor: "#cbd5e1" }
              }
            >
              {selected === role && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>
          </div>

          <div>
            <p className="text-base font-semibold text-slate-800">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{tagline}</p>
          </div>

          <ul className="space-y-1.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-xs text-slate-500">
                <Check size={11} className="text-teal-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-select role from URL query param
  const initialRole = searchParams.get("role") === "clinic" ? "CLINIC_ADMIN" : searchParams.get("role") === "patient" ? "PATIENT" : null;

  const [step, setStep] = useState<Step>(initialRole ? 2 : 1);
  const [role, setRole] = useState<Role>(initialRole);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Patient fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");

  // Clinic fields
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function clearError(key: string) {
    setFieldErrors((p) => { const n = { ...p }; delete n[key]; return n; });
  }

  function goNext() {
    if (!role) {
      setErrorMsg("Please select a role to continue.");
      return;
    }
    setErrorMsg("");
    setStep(2);
  }

  function validateStep2() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8) errors.password = "Must be at least 8 characters";
    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (role === "PATIENT") {
      if (!firstName.trim()) errors.firstName = "First name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
    }
    if (role === "CLINIC_ADMIN") {
      if (!clinicName.trim()) errors.clinicName = "Clinic name is required";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validateStep2();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("loading");
    setErrorMsg("");

    const body =
      role === "PATIENT"
        ? { role, email: email.trim().toLowerCase(), password, firstName: firstName.trim(), lastName: lastName.trim(), dateOfBirth: dob || undefined, phone: phone || undefined }
        : { role, email: email.trim().toLowerCase(), password, clinicName: clinicName.trim(), address: address || undefined, phone: clinicPhone || undefined, licenseNumber: licenseNumber || undefined };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        const err = data.error;
        if (typeof err === "object") {
          const flat = Object.entries(err as Record<string, string[]>)
            .map(([k, v]) => `${k}: ${v.join(", ")}`)
            .join("; ");
          setErrorMsg(flat || "Registration failed.");
        } else {
          setErrorMsg(err ?? "Registration failed. Please try again.");
        }
        return;
      }

      // Redirect based on role
      const redirectTo = role === "PATIENT" ? "/patient" : "/clinic";
      router.push(redirectTo);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl text-slate-900 mb-1">
            {step === 1 ? "Create an account" : role === "PATIENT" ? "Your details" : "Clinic details"}
          </h1>
          <p className="text-slate-500 text-sm">
            {step === 1
              ? "Choose how you want to use Aláfíà."
              : "Fill in your details to complete registration."}
          </p>
        </div>
        <StepIndicator current={step} total={2} />
      </div>

      {/* Error banner */}
      {(status === "error" && errorMsg) && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">!</span>
          </div>
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}
      {step === 1 && errorMsg && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-amber-500 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">!</span>
          </div>
          <p className="text-sm text-amber-700">{errorMsg}</p>
        </div>
      )}

      {/* ── Step 1: Role selection ── */}
      {step === 1 && (
        <div className="space-y-5">
          <RolePicker
            selected={role}
            onSelect={(r) => { setRole(r); setErrorMsg(""); }}
          />
          <button
            type="button"
            onClick={goNext}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl",
              "text-sm font-semibold text-white",
              "bg-teal-700 hover:bg-teal-800",
              "shadow-[0_4px_14px_rgba(30,125,99,0.25)] hover:shadow-[0_7px_20px_rgba(30,125,99,0.35)]",
              "transition-all duration-200 hover:-translate-y-px active:translate-y-0",
            )}
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* ── Step 2: Details form ── */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Patient fields */}
          {role === "PATIENT" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="reg-first-name"
                  label="First name"
                  value={firstName}
                  onChange={(v) => { setFirstName(v); clearError("firstName"); }}
                  placeholder="Ada"
                  error={fieldErrors.firstName}
                  icon={User}
                  disabled={status === "loading"}
                  autoComplete="given-name"
                />
                <Field
                  id="reg-last-name"
                  label="Last name"
                  value={lastName}
                  onChange={(v) => { setLastName(v); clearError("lastName"); }}
                  placeholder="Okonkwo"
                  error={fieldErrors.lastName}
                  disabled={status === "loading"}
                  autoComplete="family-name"
                />
              </div>
              <Field
                id="reg-dob"
                label="Date of birth"
                type="date"
                value={dob}
                onChange={setDob}
                error={fieldErrors.dob}
                icon={Calendar}
                optional
                disabled={status === "loading"}
              />
              <Field
                id="reg-phone"
                label="Phone number"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+234 80 0000 0000"
                error={fieldErrors.phone}
                icon={Phone}
                optional
                disabled={status === "loading"}
                autoComplete="tel"
              />
            </>
          )}

          {/* Clinic fields */}
          {role === "CLINIC_ADMIN" && (
            <>
              <Field
                id="reg-clinic-name"
                label="Clinic name"
                value={clinicName}
                onChange={(v) => { setClinicName(v); clearError("clinicName"); }}
                placeholder="Lagos Community Clinic"
                error={fieldErrors.clinicName}
                icon={Building2}
                disabled={status === "loading"}
              />
              <Field
                id="reg-address"
                label="Address"
                value={address}
                onChange={setAddress}
                placeholder="15 Marina Street, Lagos"
                error={fieldErrors.address}
                icon={MapPin}
                optional
                disabled={status === "loading"}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="reg-clinic-phone"
                  label="Phone"
                  type="tel"
                  value={clinicPhone}
                  onChange={setClinicPhone}
                  placeholder="+234..."
                  error={fieldErrors.clinicPhone}
                  icon={Phone}
                  optional
                  disabled={status === "loading"}
                />
                <Field
                  id="reg-license"
                  label="License no."
                  value={licenseNumber}
                  onChange={setLicenseNumber}
                  placeholder="MDCN-12345"
                  error={fieldErrors.licenseNumber}
                  icon={FileText}
                  optional
                  disabled={status === "loading"}
                />
              </div>
            </>
          )}

          {/* Shared: email + password */}
          <div className="pt-1 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Account credentials</p>
            <div className="space-y-4">
              <Field
                id="reg-email"
                label="Email address"
                type="email"
                value={email}
                onChange={(v) => { setEmail(v); clearError("email"); }}
                placeholder="you@example.com"
                error={fieldErrors.email}
                icon={Mail}
                disabled={status === "loading"}
                autoComplete="email"
              />
              <Field
                id="reg-password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(v) => { setPassword(v); clearError("password"); }}
                placeholder="At least 8 characters"
                error={fieldErrors.password}
                icon={Lock}
                disabled={status === "loading"}
                autoComplete="new-password"
                rightElement={
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
              <Field
                id="reg-confirm"
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(v) => { setConfirmPassword(v); clearError("confirmPassword"); }}
                placeholder="Repeat your password"
                error={fieldErrors.confirmPassword}
                icon={Lock}
                disabled={status === "loading"}
                autoComplete="new-password"
                rightElement={
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-slate-400 hover:text-slate-600 transition-colors" tabIndex={-1}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </div>
          </div>

          {/* Terms notice */}
          <p className="text-xs text-slate-400 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-teal-600 hover:underline no-underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-teal-600 hover:underline no-underline">Privacy Policy</Link>.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={() => { setStep(1); setStatus("idle"); setErrorMsg(""); setFieldErrors({}); }}
              className={cn(
                "flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl",
                "border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                "text-sm font-medium text-slate-600",
                "transition-all duration-200",
              )}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl",
                "text-sm font-semibold text-white",
                "bg-teal-700 hover:bg-teal-800",
                "shadow-[0_4px_14px_rgba(30,125,99,0.25)] hover:shadow-[0_7px_20px_rgba(30,125,99,0.35)]",
                "transition-all duration-200 hover:-translate-y-px active:translate-y-0",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
              )}
            >
              {status === "loading" ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {role === "PATIENT" ? "Create account" : "Register clinic"}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Sign in link */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700 no-underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
