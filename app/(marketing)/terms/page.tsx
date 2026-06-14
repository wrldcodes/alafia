import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-teal-900 mb-4">Terms of Service</h1>
      <p className="text-slate-600 text-sm leading-relaxed mb-8">
        Our full terms of service are being finalised. By using Aláfíà you agree to use the
        platform responsibly and in accordance with applicable healthcare regulations.
      </p>
      <Link href="/" className="text-sm font-medium text-teal-600 hover:text-teal-700 no-underline">
        Back to home
      </Link>
    </main>
  );
}
