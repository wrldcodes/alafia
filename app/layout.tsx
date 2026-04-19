import type { Metadata } from 'next'
import './globals.css'
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider'
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
      <head>
        <link
          rel="preload"
          as="image"
          href='/hero-poster.jpg'
          fetchPriority='high'
        />
      </head>
        
      <body>
        <SmoothScrollProvider>  
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
