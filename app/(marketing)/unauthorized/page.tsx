import Link from "next/link";
import { asRoute } from "@/lib/routes";

export default function UnauthorizedPage() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-teal-900 mb-3">Access denied</h1>
      <p className="text-slate-600 text-sm mb-8">
        You don&apos;t have permission to view this page. Sign in with the correct account or
        contact your clinic administrator.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={asRoute("/login")}
          className="rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-teal-800"
        >
          Sign in
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-sand-200 px-5 py-2.5 text-sm font-medium text-slate-600 no-underline hover:border-teal-200"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
