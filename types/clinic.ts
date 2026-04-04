// ── Clinic types ──────────────────────────────────────────────────────────────

export type ClinicType =
  | 'General practice / Primary care'
  | 'Community health centre'
  | 'Teaching hospital'
  | 'Specialist clinic'
  | 'Maternity / Antenatal clinic'
  | 'Dental clinic'
  | 'Eye clinic / Ophthalmology'
  | 'Mental health clinic'
  | 'Pharmacy clinic'
  | 'Rural health post'
  | 'Private hospital'
  | 'Other'

export type StaffRole =
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Pharmacist'
  | 'Lab technician'
  | 'Admin'

export type AdminRole =
  | 'Clinic owner'
  | 'Medical director'
  | 'Practice manager'
  | 'Administrator'

export interface OperatingHours {
  day: string
  open: string    // "08:00"
  close: string   // "17:00"
  closed: boolean
}

export interface Clinic {
  id: string              // CLN-XXXXXX
  name: string
  type: ClinicType
  description?: string
  yearEstablished?: number
  bedCount?: number
  state: string
  lga?: string
  city?: string
  address: string
  phone: string
  email?: string
  website?: string
  services: string[]
  insurance: string[]
  languages: string[]
  hours: OperatingHours[]
  verified: boolean
  registeredAt: string
  distanceKm?: number     // populated client-side from geolocation
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: StaffRole
  clinicId: string
  invitedAt: string
  acceptedAt?: string
}

// ── Clinic signup form ────────────────────────────────────────────────────────

export interface ClinicSignupStep1 {
  name: string
  type: ClinicType | ''
  description: string
  yearEstablished: string
  bedCount: string
}

export interface ClinicSignupStep2 {
  state: string
  lga: string
  city: string
  address: string
  phone: string
  email: string
  website: string
  hours: OperatingHours[]
}

export interface ClinicSignupStep3 {
  services: string[]
  insurance: string[]
  languages: string[]
}

export interface ClinicSignupStep4 {
  adminFirstName: string
  adminLastName: string
  adminEmail: string
  adminPassword: string
  adminRole: AdminRole | ''
  teamMembers: Omit<TeamMember, 'id' | 'clinicId' | 'invitedAt'>[]
}

export interface ClinicSignupFormData
  extends ClinicSignupStep1,
    ClinicSignupStep2,
    ClinicSignupStep3,
    ClinicSignupStep4 {}
