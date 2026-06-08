"use client";

// app/(auth)/login/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Stethoscope, User } from "lucide-react";
import { cn } from "@/lib/utils";

type LoginState = "idle" | "loading" | "error";

// ─── Inline field component ───────────────────────────────────────────────────
function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  rightElement,
  disabled,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  icon: React.ElementType;
  rightElement?: React.ReactNode;
  disabled?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Icon size={16} />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            "w-full pl-10 pr-4 py-3 text-sm text-slate-800 bg-white",
            "border rounded-xl transition-all duration-200 outline-none",
            "placeholder:text-slate-300",
            "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
              : "border-slate-200 hover:border-slate-300",
            rightElement && "pr-11",
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

// ─── Divider ─────────────────────────────────────────────────────────────────
function Divider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

// ─── Quick-access role card ───────────────────────────────────────────────────
function RoleCard({
  role,
  label,
  description,
  icon: Icon,
  color,
  selected,
  onClick,
}: {
  role: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all duration-200",
        selected
          ? "border-teal-400 bg-teal-50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      )}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}18`, color }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", selected ? "text-teal-800" : "text-slate-700")}>
          {label}
        </p>
        <p className="text-xs text-slate-400 truncate">{description}</p>
      </div>
      <div
        className={cn(
          "h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center",
          selected ? "border-teal-500 bg-teal-500" : "border-slate-300",
        )}
      >
        {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
      </div>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<LoginState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const errors: typeof fieldErrors = {};
    if (!email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email";
    if (!password) errors.password = "Password is required";
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Login failed. Please try again.");
        return;
      }

      // Redirect to the role-appropriate dashboard
      const redirectTo: string = data.redirectTo ?? "/clinic";
      router.push(redirectTo);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection.");
    }
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500 text-sm">
          Sign in to your Aláfíà account to continue.
        </p>
      </div>

      {/* Quick role selection (just visual hint, not used in submit) */}
      <div className="space-y-2.5 mb-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sign in as</p>
        <div className="grid grid-cols-2 gap-2.5">
          <RoleCardSimple
            label="Patient"
            description="Book & manage care"
            icon={User}
            color="#3aab8a"
            href="/login"
          />
          <RoleCardSimple
            label="Clinic / Doctor"
            description="Manage your practice"
            icon={Stethoscope}
            color="#6366f1"
            href="/login"
          />
        </div>
      </div>

      <Divider label="or sign in with email" />

      {/* Error banner */}
      {status === "error" && errorMsg && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">!</span>
          </div>
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <Field
          id="login-email"
          label="Email address"
          type="email"
          value={email}
          onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: undefined })); }}
          placeholder="you@example.com"
          error={fieldErrors.email}
          icon={Mail}
          disabled={status === "loading"}
          autoComplete="email"
        />

        <Field
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(v) => { setPassword(v); setFieldErrors((p) => ({ ...p, password: undefined })); }}
          placeholder="Enter your password"
          error={fieldErrors.password}
          icon={Lock}
          disabled={status === "loading"}
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        {/* Forgot password row */}
        <div className="flex justify-end -mt-1">
          <Link
            href="/forgot-password"
            className="text-xs text-teal-600 hover:text-teal-700 no-underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl",
            "text-sm font-semibold text-white",
            "bg-teal-700 hover:bg-teal-800",
            "shadow-[0_4px_14px_rgba(30,125,99,0.25)] hover:shadow-[0_7px_20px_rgba(30,125,99,0.35)]",
            "transition-all duration-200",
            "-translate-y-0 hover:-translate-y-px active:translate-y-0",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          )}
        >
          {status === "loading" ? (
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Sign in <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-6">
        <Divider label="new to Aláfíà?" />
      </div>

      {/* Sign up links */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          href="/register?role=patient"
          className={cn(
            "flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl",
            "border border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50",
            "text-sm font-medium text-slate-600 hover:text-teal-700",
            "transition-all duration-200 no-underline",
          )}
        >
          <User size={14} />
          Patient sign up
        </Link>
        <Link
          href="/register?role=clinic"
          className={cn(
            "flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl",
            "border border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50",
            "text-sm font-medium text-slate-600 hover:text-indigo-700",
            "transition-all duration-200 no-underline",
          )}
        >
          <Stethoscope size={14} />
          Clinic sign up
        </Link>
      </div>
    </div>
  );
}

// Simple static role card (no form logic — just visual)
function RoleCardSimple({
  label,
  description,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-3 rounded-xl border border-slate-200 bg-white",
      )}
    >
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg mb-1"
        style={{ backgroundColor: `${color}18`, color }}
      >
        <Icon size={16} />
      </div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400 leading-tight">{description}</p>
    </div>
  );
}