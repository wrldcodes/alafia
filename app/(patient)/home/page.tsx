import type { Metadata } from 'next'
import { PatientDashboard } from '@/components/patient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'My Health Portal',
  description:
    'View your appointments, medical records, and find clinics near you.',
}

export default function PatientDashboardPage() {
  return <PatientDashboard />
}
