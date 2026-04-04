// app/(marketing)/page.tsx
import {
  Navbar, Hero, TrustStrip, TwoAudiences,
  HowItWorks, Features, FinalCTA, Footer,
} from '@/components/marketing'

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
