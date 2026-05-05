// ── Patient types ─────────────────────────────────────────────────────────────

export type Gender = 'Male' | 'Female' | 'Prefer not to say'

export interface PatientData {
  firstName: string
  lastName: string
  dateOfBirth: string
  phone: string
}

export type BloodGroup =
  | 'A+' | 'A−'
  | 'B+' | 'B−'
  | 'AB+' | 'AB−'
  | 'O+' | 'O−'
  | 'Unknown'



export interface Patient {
  id: string              // ALF-XXXXXX
  firstName: string
  lastName: string
  dateOfBirth: string     // ISO 8601 — "1993-03-14"
  gender: Gender
  bloodGroup?: BloodGroup
  phone: string
  email?: string
  state: string
  lga?: string
  address?: string
  primaryClinicId: string
  enrolledAt: string      // ISO 8601
  totalVisits: number
  status: 'active' | 'pending' | 'inactive'
}

export interface Vitals {
  bloodPressure: string   // e.g. "118/76"
  temperature: number     // Fahrenheit
  pulse: number           // bpm
  weight?: number         // kg
  height?: number         // cm
  recordedAt: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  clinicId: string
  doctorName: string
  recordType: string
  notes: string
  attachments?: string[]  // file URLs
  createdAt: string
}

// ── Enrollment form ───────────────────────────────────────────────────────────

export interface EnrollmentStep1 {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: Gender | ''
  bloodGroup: BloodGroup | ''
}

export interface EnrollmentStep2 {
  phone: string
  email: string
  state: string
  lga: string
  address: string
}

export interface EnrollmentStep3 {
  clinicId: string
  clinicName: string
}

export interface EnrollmentFormData
  extends EnrollmentStep1,
    EnrollmentStep2,
    EnrollmentStep3 {}
