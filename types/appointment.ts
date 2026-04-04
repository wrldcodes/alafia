// ── Appointment types ─────────────────────────────────────────────────────────

export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'completed'
  | 'no-show'

export type AppointmentType =
  | 'General consultation'
  | 'Follow-up'
  | 'Antenatal'
  | 'Diabetes management'
  | 'Lab results review'
  | 'Blood pressure check'
  | 'Immunisation'
  | 'Emergency'
  | 'Other'

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientInitials: string
  clinicId: string
  clinicName: string
  doctorName: string
  type: AppointmentType | string
  date: string            // ISO 8601 date "2025-04-02"
  time: string            // "09:00"
  status: AppointmentStatus
  notes?: string
  createdAt: string
}

export interface BookingFormData {
  patientId: string
  clinicId: string
  doctorName: string
  type: string
  date: string
  time: string
  notes?: string
}
