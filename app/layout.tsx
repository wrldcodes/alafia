import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Aláfíà — Health for Every Community',
    template: '%s | Aláfíà',
  },
  description:
    'Aláfíà connects patients in local and rural communities to clinics near them — while giving healthcare providers the tools to serve more people, better.',
  keywords: ['healthcare', 'clinic management', 'community health', 'Nigeria', 'patient portal'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
