"use client";

import { useState } from "react";
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
  LogoMark,
  Field,
  AuthInput,
  AuthButton,
  ErrorBanner,
} from "@/components/auth/AuthCard";
import RoleCard from "@/components/auth/RoleCard";

type Role = "PATIENT" | "CLINIC";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid email or password");
        return;
      }

      router.push(data.redirectTo ?? "/clinic");
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
          New to Alafia?{" "}
          <Link href="/register" className="text-[#0F6E56] hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <LogoMark />

      <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-1">
        Welcome back
      </h1>
      <p className="text-[12px] text-[#9a9890] mb-6 leading-relaxed">
        Sign in to your Alafia account to continue.
      </p>

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
        <div className="flex-1 h-px bg-[#e8e6e0]" />
        <span className="text-[10px] text-[#c0bdb5]">
          or sign in with email
        </span>
        <div className="flex-1 h-px bg-[#e8e6e0]" />
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
        <Field id="login-email" label="Email address">
          <AuthInput
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={13} />}
            error={!!error}
            required
          />
        </Field>

        <Field id="login-password" label="Password">
          <AuthInput
            id="login-password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={13} />}
            error={!!error}
            required
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((value) => !value)}
                className="text-[#c0bdb5] hover:text-[#888] transition-colors"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            }
          />
          <div className="text-right mt-1.5">
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#0F6E56] hover:text-[#085041]"
            >
              Forgot password?
            </Link>
          </div>
        </Field>

        <AuthButton loading={loading} className="mt-2">
          {loading ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Signing in...
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
