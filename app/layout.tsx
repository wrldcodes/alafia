import type { Metadata } from 'next'
import './globals.css'

const baseUrl = 'https://alafia-ara.vercel.app'

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: 'Alafia - Health for Every Community',
      template: '%s | Alafia',
    },
    description: ' clinic management and patient portal system',
    keywords: [
      'clinic management',
      'patient portal',
      'healthcare',
      'health platform',
      'community health',
      'patient records',
      'appointment scheduling',
      'medical management',
      'telemedicine',
      'health for communities',
    ],
    authors: [
      {
        name: 'Alafia Team',
        url: baseUrl,
      },
    ],
    creator: 'Alafia',
    publisher: 'Alafia',
    generator: 'Next.js',
    applicationName: 'Alafia',
    category: 'Healthcare',
    
    openGraph: {
      title: 'Alafia - Health for Every Community',
      description: 'Comprehensive clinic management and patient portal system connecting communities to healthcare providers.',
      url: baseUrl,
      siteName: 'Alafia',
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: '/opengraph-image.jpeg',
          width: 1200,
          height: 630,
          alt: 'Alafia platform - Healthcare for communities',
          type: 'image/jpeg',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: 'Alafia - Health for Every Community',
      description: 'Comprehensive clinic management and patient portal system.',
      images: ['/opengraph-image.jpeg'],
      creator: '@alafiahealth',
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: '/',
    },

    verification: {
      google: 'paste-your-google-verification-code',
    },

    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },

    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Alafia',
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
