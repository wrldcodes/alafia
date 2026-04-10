// app/(marketing)/page.tsx
import type { Metadata } from "next";
import {
  Navbar,
  Hero,
  TrustStrip,
  TwoAudiences,
  HowItWorks,
  Features,
  FinalCTA,
  Footer,
} from "@/components/marketing";

const siteUrl = "https://alafia-ara.vercel.app";

// app/(marketing)/page.tsx
export const metadata: Metadata = {
  title: 'Aláfíà',
  description: 'Aláfíà connects patients ',
  openGraph: {
    type: 'website',
    title: 'Aláfíà ',
    description: 'Aláfíà connects patient',
    url: 'https://alafia-ara.vercel.app',
    siteName: 'Aláfíà',
    // No images array needed — Next.js reads opengraph-image.jpeg automatically
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aláfíà ',
  },
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <TwoAudiences />
        <HowItWorks />
        <Features />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
