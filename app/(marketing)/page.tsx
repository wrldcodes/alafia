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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aláfíà — Health for Every Community",
  openGraph: {
    type: "website",
    title: "Aláfíà — Health for Every Community",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/opengraph-image.jpeg`,
        width: 1200,
        height: 630,
        alt: "Aláfíà social preview image",
      },
    ],
  },
};

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
