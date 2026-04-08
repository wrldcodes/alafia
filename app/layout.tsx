import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Aláfíà — Health for Every Community',
    template: '%s | Aláfíà',
  },
  keywords: ['healthcare', 'clinic management', 'community health', 'Nigeria', 'patient portal'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
