"use client";

// app/(auth)/forgot-password/page.tsx
// 4-step flow with react-hook-form + zodResolver.
// Step 1: email — Step 2: OTP — Step 3: new password — Step 4: success
// Phase 6 will wire real API endpoints. Steps 2-3 use simulated delay now.

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Send,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";
import {
  AuthCard,
  StepDots,
  Field,
  AuthInput,
  AuthButton,
  GhostButton,
  ErrorBanner,
  StrengthBar,
} from "@/components/auth/AuthCard";
import OtpInput from "@/components/auth/OtpInput";

// ── Zod schemas ───────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[0-9]/, "Must contain a number")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
    confirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type EmailForm = z.infer<typeof emailSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const SLIDE = {
  enter: { x: 32, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -32, opacity: 0 },
};

const OTP_SECONDS = 600;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [sentEmail, setSentEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [apiError, setApiError] = useState("");
  const [timer, setTimer] = useState(OTP_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // ── Email form ────────────────────────────────────────────────────────
  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    mode: "onBlur",
  });

  // ── Password form ─────────────────────────────────────────────────────
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const newPassword = passwordForm.watch("password") ?? "";

  // ── OTP countdown ─────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 2) return;
    setTimer(OTP_SECONDS);
    setCanResend(false);
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  function formatTimer(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  // ── Step 1 — send code ────────────────────────────────────────────────
  async function onSendCode(data: EmailForm) {
    setApiError("");
    try {
      // Phase 6: POST /api/auth/forgot-password { email: data.email }
      await new Promise((r) => setTimeout(r, 700));
      setSentEmail(data.email);
      setStep(2);
    } catch {
      setApiError("Failed to send code. Please try again.");
    }
  }

  // ── Step 2 — verify OTP ───────────────────────────────────────────────
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");
    if (otp.join("").length < 6) {
      setApiError("Please enter all 6 digits.");
      return;
    }
    try {
      // Phase 6: POST /api/auth/verify-otp { email: sentEmail, code: otp.join("") }
      await new Promise((r) => setTimeout(r, 600));
      setStep(3);
    } catch {
      setApiError("Incorrect code. Please try again.");
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────
  async function handleResend() {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setCanResend(false);
    setTimer(OTP_SECONDS);
    // Phase 6: POST /api/auth/resend-otp { email: sentEmail }
    await new Promise((r) => setTimeout(r, 400));
    const id = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  // ── Step 3 — set new password ─────────────────────────────────────────
  async function onSetPassword() {
    setApiError("");
    try {
      // Phase 6: POST /api/auth/reset-password { email, otp, newPassword: data.password }
      await new Promise((r) => setTimeout(r, 700));
      setStep(4);
    } catch {
      setApiError("Failed to reset password. Please try again.");
    }
  }

  // ── Error hint helper ─────────────────────────────────────────────────
  function err(msg: string | undefined) {
    return msg ? (
      <p className="text-[10px] text-[#E24B4A] mt-1">{msg}</p>
    ) : null;
  }

  const otpComplete = otp.every(Boolean);

  return (
    <AuthCard>
      <AnimatePresence mode="wait">
        {/* ── Step 1 — enter email ──────────────────────── */}
        {step === 1 && (
          <motion.div
            key="s1"
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-[11px] text-[#9a9890] hover:text-[#1a1a18] dark:hover:text-[#f0ede8] transition-colors mb-5"
            >
              <ArrowLeft size={11} /> Back to sign in
            </Link>

            <StepDots total={4} current={1} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-1">
              Forgot password?
            </h1>
            <p className="text-[12px] text-[#9a9890] dark:text-[#555450] mb-6 leading-relaxed">
              Enter the email linked to your account and we&apos;ll send you a reset
              code.
            </p>

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

            <form onSubmit={emailForm.handleSubmit(onSendCode)} noValidate>
              <Field
                label="Email address"
                hint={err(emailForm.formState.errors.email?.message)}
              >
                <AuthInput
                  {...emailForm.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={12} />}
                  error={!!emailForm.formState.errors.email}
                  autoComplete="email"
                />
              </Field>

              <AuthButton
                loading={emailForm.formState.isSubmitting}
                className="mt-2 mb-2"
              >
                {emailForm.formState.isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Send reset code
                  </>
                )}
              </AuthButton>

              <GhostButton type="button" onClick={() => router.push("/login")}>
                <ArrowLeft size={12} /> Back to sign in
              </GhostButton>
            </form>
          </motion.div>
        )}

        {/* ── Step 2 — OTP ─────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="s2"
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setApiError("");
              }}
              className="flex items-center gap-1.5 text-[11px] text-[#9a9890] hover:text-[#1a1a18] dark:hover:text-[#f0ede8] transition-colors mb-5"
            >
              <ArrowLeft size={11} /> Back
            </button>

            <StepDots total={4} current={2} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-1">
              Check your email
            </h1>
            <p className="text-[12px] text-[#9a9890] dark:text-[#555450] mb-4 leading-relaxed">
              Enter the 6-digit code we sent. Expires in 10 minutes.
            </p>

            {/* Sent-to hint */}
            <div className="flex items-center gap-3 p-3 bg-[#f5f4f0] dark:bg-[#232320] rounded-lg mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#E1F5EE] dark:bg-[#0F3028] flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-[#0F6E56]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#1a1a18] dark:text-[#f0ede8]">
                  {sentEmail}
                </p>
                <p className="text-[10px] text-[#9a9890] dark:text-[#555450]">
                  Check spam if you don&apos;t see it
                </p>
              </div>
            </div>

            <AnimatePresence>
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <ErrorBanner message={apiError} />
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleVerifyOtp}>
              <OtpInput value={otp} onChange={setOtp} error={!!apiError} />

              {/* Resend + timer */}
              <div className="flex items-center justify-between mt-3 mb-5">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={[
                    "text-[11px] transition-colors",
                    canResend
                      ? "text-[#0F6E56] hover:text-[#085041] cursor-pointer"
                      : "text-[#c0bdb5] dark:text-[#3a3a38] cursor-not-allowed",
                  ].join(" ")}
                >
                  Resend code
                </button>
                <span className="text-[11px] text-[#9a9890] dark:text-[#555450] tabular-nums">
                  {timer > 0 ? formatTimer(timer) : "Expired"}
                </span>
              </div>

              <AuthButton disabled={!otpComplete}>
                Verify code <ArrowRight size={13} />
              </AuthButton>
            </form>
          </motion.div>
        )}

        {/* ── Step 3 — new password ─────────────────────── */}
        {step === 3 && (
          <motion.div
            key="s3"
            variants={SLIDE}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <StepDots total={4} current={3} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-1">
              Set new password
            </h1>
            <p className="text-[12px] text-[#9a9890] dark:text-[#555450] mb-6 leading-relaxed">
              Choose a strong password for your account.
            </p>

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

            <form
              onSubmit={passwordForm.handleSubmit(onSetPassword)}
              noValidate
            >
              <Field
                label="New password"
                hint={
                  passwordForm.formState.errors.password ? (
                    err(passwordForm.formState.errors.password.message)
                  ) : (
                    <StrengthBar password={newPassword} />
                  )
                }
              >
                <AuthInput
                  {...passwordForm.register("password")}
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  icon={<Lock size={12} />}
                  error={!!passwordForm.formState.errors.password}
                  autoComplete="new-password"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  }
                />
              </Field>

              <Field
                label="Confirm password"
                hint={err(passwordForm.formState.errors.confirm?.message)}
              >
                <AuthInput
                  {...passwordForm.register("confirm")}
                  type={showCf ? "text" : "password"}
                  placeholder="Repeat password"
                  icon={<Lock size={12} />}
                  error={!!passwordForm.formState.errors.confirm}
                  autoComplete="new-password"
                  trailing={
                    passwordForm.watch("confirm") &&
                    !passwordForm.formState.errors.confirm ? (
                      <CheckCircle
                        size={12}
                        className="text-[#0F6E56]"
                        aria-hidden="true"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCf(!showCf)}
                        aria-label={showCf ? "Hide" : "Show"}
                      >
                        {showCf ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    )
                  }
                />
              </Field>

              <AuthButton
                loading={passwordForm.formState.isSubmitting}
                className="mt-2"
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Resetting…
                  </>
                ) : (
                  <>
                    Reset password <ArrowRight size={13} />
                  </>
                )}
              </AuthButton>
            </form>
          </motion.div>
        )}

        {/* ── Step 4 — success ──────────────────────────── */}
        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center text-center py-4"
          >
            <StepDots total={4} current={5} />

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mb-5"
            >
              <div className="w-16 h-16 rounded-full bg-[#E1F5EE] dark:bg-[#0F3028] flex items-center justify-center">
                <CheckCircle
                  size={28}
                  className="text-[#0F6E56]"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute inset-[-6px] rounded-full border-2 border-[#9FE1CB] opacity-40" />
            </motion.div>

            <h1 className="text-[20px] font-medium text-[#1a1a18] dark:text-[#f0ede8] tracking-tight mb-2">
              Password reset
            </h1>
            <p className="text-[12px] text-[#9a9890] dark:text-[#555450] leading-relaxed mb-7 max-w-[260px]">
              Your password has been updated. You can now sign in with your new
              password.
            </p>

            <AuthButton
              onClick={() => router.push("/login")}
              className="max-w-[240px]"
            >
              Back to sign in <ArrowRight size={13} />
            </AuthButton>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  );
}
