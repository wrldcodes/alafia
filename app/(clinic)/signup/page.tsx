import type { Metadata } from 'next'
import { ClinicSignupFlow } from '@/components/clinic'

export const metadata: Metadata = {
  title: 'Register Your Clinic',
  description: 'Set up your clinic on Aláfíà and start receiving patients from your community.',
}

export default function ClinicSignupPage() {
  return <ClinicSignupFlow />
}
