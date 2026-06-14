import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-teal-900 mb-4">Privacy Policy</h1>
      <p className="text-slate-600 text-sm leading-relaxed mb-8">
        We take patient and clinic data seriously. Our full privacy policy is being finalised.
        Health records are stored securely and accessed only by authorised users.
      </p>
      <Link href="/" className="text-sm font-medium text-teal-600 hover:text-teal-700 no-underline">
        Back to home
      </Link>
    </main>
  );
}
