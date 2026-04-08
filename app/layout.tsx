import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Alafia - Health for Every Community',
  description: 'clinic management and patient portal system',
  openGraph: {
    title: 'Alafia - Health for Every Community',
    description: 'Clinic management and patient portal system for communities.',
    url: 'https://alafia-ara.vercel.app',
    siteName: 'Alafia',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Preview of Alafia platform',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

