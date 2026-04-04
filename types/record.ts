// ── Medical record types ──────────────────────────────────────────────────────

export type RecordType =
  | 'General consultation'
  | 'Lab results'
  | 'Vitals log'
  | 'Prescription'
  | 'Imaging'
  | 'Referral'
  | 'Discharge summary'
  | 'Other'

export interface MedicalRecord {
  id: string
  patientId: string
  clinicId: string
  clinicName: string
  doctorName: string
  recordType: RecordType | string
  notes: string
  attachments?: Attachment[]
  createdAt: string
}

export interface Attachment {
  id: string
  name: string
  url: string
  mimeType: string
  sizeBytes: number
  uploadedAt: string
}
