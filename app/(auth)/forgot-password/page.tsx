"use client";

// app/(auth)/forgot-password/page.tsx
// 4-step flow:
//   Step 1 — enter email
//   Step 2 — enter OTP (frontend only, backend wired in Phase 6)
//   Step 3 — set new password
//   Step 4 — success

import { useState, useEffect } from "react";
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
  LogoMark,
  StepDots,
  Field,
  AuthInput,
  AuthButton,
  GhostButton,
  ErrorBanner,
  StrengthBar,
} from "@/components/auth/AuthCard";
import OtpInput from "@/components/auth/OtpInput";

const SLIDE = {
  enter: { x: 32, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -32, opacity: 0 },
};

const OTP_SECONDS = 600; // 10 minutes

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(OTP_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== 2) return;
    const timeoutId = setTimeout(() => {
      setTimer(OTP_SECONDS);
      setCanResend(false);
    }, 0);
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
    return () => {
      clearTimeout(timeoutId);
      clearInterval(id);
    };
  }, [step]);

  function formatTimer(s: number) {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  // Step 1 — send OTP
  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Phase 6 will wire this to a real OTP send endpoint
      // For now we just simulate a delay and advance
      await new Promise((r) => setTimeout(r, 800));
      setStep(2);
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    try {
      // Phase 6: POST /api/auth/verify-otp { email, code }
      await new Promise((r) => setTimeout(r, 600));
      setStep(3);
    } catch {
      setError("Incorrect code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — resend OTP
  async function handleResend() {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setTimer(OTP_SECONDS);
    setCanResend(false);
    // Phase 6: POST /api/auth/resend-otp { email }
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

  // Step 3 — reset password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      // Phase 6: POST /api/auth/reset-password { email, otp, newPassword }
      await new Promise((r) => setTimeout(r, 700));
      setStep(4);
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const otpComplete = otp.every(Boolean);

  return (
    <AuthCard>
      <LogoMark />

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
            <div className="flex items-center gap-2 mb-5">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[11px] text-[#9a9890] hover:text-[#1a1a18] transition-colors"
              >
                <ArrowLeft size={11} /> Back to sign in
              </Link>
            </div>

            <StepDots total={4} current={1} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-1">
              Forgot password?
            </h1>
            <p className="text-[12px] text-[#9a9890] mb-6 leading-relaxed">
              {"Enter the email linked to your account and we'll send you a reset code."}
            </p>

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

            <form onSubmit={handleSendCode}>
              <Field id="forgot-email" label="Email address">
                <AuthInput
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail size={12} />}
                  required
                />
              </Field>

              <AuthButton loading={loading} className="mt-2 mb-2">
                {loading ? (
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
                setError("");
              }}
              className="flex items-center gap-1.5 text-[11px] text-[#9a9890] hover:text-[#1a1a18] mb-5 transition-colors"
            >
              <ArrowLeft size={11} /> Back
            </button>

            <StepDots total={4} current={2} />

            <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-1">
              Check your email
            </h1>
            <p className="text-[12px] text-[#9a9890] mb-5 leading-relaxed">
              Enter the 6-digit code we sent. It expires in 10 minutes.
            </p>

            {/* Email hint */}
            <div className="flex items-center gap-3 p-3 bg-[#f5f4f0] rounded-lg mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#E1F5EE] flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-[#0F6E56]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[12px] font-medium text-[#1a1a18]">
                  {email}
                </p>
                <p className="text-[10px] text-[#9a9890]">
                  {"Check spam if you don't see it"}
                </p>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3"
                >
                  <ErrorBanner message={error} />
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleVerifyOtp}>
              <div className="mb-2">
                <OtpInput value={otp} onChange={setOtp} error={!!error} />
              </div>

              {/* Resend + timer */}
              <div className="flex items-center justify-between mb-5 mt-3">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className={[
                    "text-[11px] transition-colors",
                    canResend
                      ? "text-[#0F6E56] hover:text-[#085041] cursor-pointer"
                      : "text-[#c0bdb5] cursor-not-allowed",
                  ].join(" ")}
                >
                  Resend code
                </button>
                <span className="text-[11px] text-[#9a9890] tabular-nums">
                  {timer > 0 ? formatTimer(timer) : "Expired"}
                </span>
              </div>

              <AuthButton loading={loading} disabled={!otpComplete}>
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Verifying…
                  </>
                ) : (
                  <>
                    Verify code <ArrowRight size={13} />
                  </>
                )}
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

            <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-1">
              Set new password
            </h1>
            <p className="text-[12px] text-[#9a9890] mb-6 leading-relaxed">
              {"Choose a strong password. You'll use this to sign in going forward."}
            </p>

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

            <form onSubmit={handleResetPassword}>
              <Field
                id="forgot-new-password"
                label="New password"
                hint={<StrengthBar password={password} />}
              >
                <AuthInput
                  id="forgot-new-password"
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
                      aria-label={showPw ? "Hide" : "Show"}
                    >
                      {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  }
                />
              </Field>

              <Field id="forgot-confirm-password" label="Confirm password">
                <AuthInput
                  id="forgot-confirm-password"
                  type={showCf ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  icon={<Lock size={12} />}
                  error={!!confirm && confirm !== password}
                  required
                  trailing={
                    confirm && confirm === password ? (
                      <CheckCircle
                        size={12}
                        className="text-[#0F6E56]"
                        aria-hidden="true"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowCf(!showCf)}
                        className="text-[#c0bdb5] hover:text-[#888]"
                        aria-label={showCf ? "Hide" : "Show"}
                      >
                        {showCf ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    )
                  }
                />
              </Field>

              <AuthButton loading={loading} className="mt-2">
                {loading ? (
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

        {/* ── Step 4 — success ─────────────────────────── */}
        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-col items-center text-center py-4"
          >
            <StepDots total={4} current={5} />

            {/* Animated success ring */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="relative mb-5"
            >
              <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center">
                <CheckCircle
                  size={28}
                  className="text-[#0F6E56]"
                  aria-hidden="true"
                />
              </div>
              <div className="absolute inset-[-6px] rounded-full border-2 border-[#9FE1CB] opacity-40" />
            </motion.div>

            <h1 className="text-[20px] font-medium text-[#1a1a18] tracking-tight mb-2">
              Password reset
            </h1>
            <p className="text-[12px] text-[#9a9890] leading-relaxed mb-7 max-w-[260px]">
              Your password has been updated successfully. You can now sign in
              with your new password.
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
