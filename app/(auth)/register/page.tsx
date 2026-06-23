import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

function RegisterFallback() {
  return (
    <div
      className="w-full rounded-2xl border border-[#e8e6e0] bg-white p-8 animate-pulse"
      aria-hidden="true"
    >
      <div className="h-4 w-32 rounded bg-[#e8e6e0] mb-6" />
      <div className="h-6 w-48 rounded bg-[#e8e6e0] mb-2" />
      <div className="h-4 w-full rounded bg-[#f5f4f0] mb-6" />
      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="h-20 rounded-xl bg-[#f5f4f0]" />
        <div className="h-20 rounded-xl bg-[#f5f4f0]" />
      </div>
      <div className="h-10 rounded-lg bg-[#e8e6e0]" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
