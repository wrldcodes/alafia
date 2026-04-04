import type { Metadata } from 'next'
import { EnrollmentFlow } from '@/components/patient'

export const metadata: Metadata = {
  title: 'Enroll as a Patient',
  description: 'Join Aláfíà and connect with clinics in your community.',
}

export default function EnrollPage() {
  return <EnrollmentFlow />
}
