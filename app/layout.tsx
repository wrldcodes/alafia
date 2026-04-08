import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:  'Aláfíà — Health for Every Community',
  description: 'clinic management and patient portal system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
