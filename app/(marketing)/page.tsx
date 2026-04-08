// app/(marketing)/page.tsx
import type { Metadata } from 'next'
import {
  Navbar, Hero, TrustStrip, TwoAudiences,
  HowItWorks, Features, FinalCTA, Footer,
} from '@/components/marketing'

const siteUrl = 'https://alafia-ara.vercel.app'

export const metadata: Metadata = {
  title: 'Aláfíà — Health for Every Community',
  description:
    'Aláfíà connects patients in local and rural communities to clinics near them — while giving healthcare providers the tools to serve more people, better.',
  openGraph: {
    type: 'website',
    title: 'Aláfíà — Health for Every Community',
    description:
      'Aláfíà connects patients in local and rural communities to clinics near them — while giving healthcare providers the tools to serve more people, better.',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Aláfíà social preview image',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aláfíà — Health for Every Community',
    description:
      'Aláfíà connects patients in local and rural communities to clinics near them — while giving healthcare providers the tools to serve more people, better.',
    images: [`${siteUrl}/opengraph-image`],
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
  )
}
