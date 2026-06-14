import Link from "next/link";
import { asRoute } from "@/lib/routes";

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-3xl text-slate-900 mb-2">Reset your password</h1>
      <p className="text-slate-500 text-sm mb-6">
        Password reset is coming soon. Contact support if you need help accessing your account.
      </p>
      <Link href={asRoute("/login")} className="text-sm font-medium text-teal-600 hover:text-teal-700 no-underline">
        Back to sign in
      </Link>
    </div>
  );
}
