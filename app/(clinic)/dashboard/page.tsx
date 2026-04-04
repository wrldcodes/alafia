import type { Metadata } from 'next'
import { ClinicDashboard } from '@/components/clinic'

export const metadata: Metadata = {
  title: 'Clinic Dashboard',
  description: 'Manage your patients, appointments, records, and billing.',
}

export default function ClinicDashboardPage() {
  return <ClinicDashboard />
}
