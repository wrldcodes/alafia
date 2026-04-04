import type { Metadata } from 'next'
import { PatientDashboard } from '@/components/patient'

export const metadata: Metadata = {
  title: 'My Health Portal',
  description: 'View your appointments, medical records, and find clinics near you.',
}

export default function PatientDashboardPage() {
  return <PatientDashboard />
}
