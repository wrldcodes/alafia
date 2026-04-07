import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Support',
  description: 'Get help with your Aláfíà account, enrollment, or clinic setup.',
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(58,171,138,0.12),transparent_40%),linear-gradient(180deg,#fbf8f3_0%,#ffffff_55%)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-600">Support</p>
          <h1 className="font-display text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.04em] text-teal-900">
            Help when you need it.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.8] text-slate-500">
            Use this page for account questions, enrollment help, or clinic onboarding support.
            If you are exploring the demo, the rest of the app is available from the main portal.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: 'Patient help',
              body: 'Questions about enrollment, booking, or your health portal.',
            },
            {
              title: 'Clinic help',
              body: 'Need help setting up a clinic dashboard or managing records?',
            },
            {
              title: 'General support',
              body: 'Something else. We will route you to the right place.',
            },
          ].map((item) => (
            <section key={item.title} className="rounded-3xl border border-sand-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <h2 className="font-display text-[22px] text-teal-900">{item.title}</h2>
              <p className="mt-3 text-[14px] leading-[1.7] text-slate-500">{item.body}</p>
            </section>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-[28px] border border-teal-100 bg-teal-50 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-teal-700">Next step</p>
            <p className="mt-1 text-[15px] text-teal-900">Return to the main portal or continue with enrollment.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-teal-200 px-5 py-2.5 text-[14px] font-medium text-teal-800 no-underline transition-colors hover:border-teal-300 hover:bg-white">
              Home
            </Link>
            <Link href="/enroll" className="inline-flex items-center justify-center rounded-full bg-teal-700 px-5 py-2.5 text-[14px] font-medium text-white no-underline transition-colors hover:bg-teal-800">
              Get started
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
