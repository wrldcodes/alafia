// ── Invoice / billing types ───────────────────────────────────────────────────

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue' | 'cancelled'

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number       // kobo (smallest NGN unit)
}

export interface Invoice {
  id: string              // INV-XXXX
  patientId: string
  patientName: string
  patientInitials: string
  clinicId: string
  items: InvoiceItem[]
  totalKobo: number       // total in kobo
  status: InvoiceStatus
  issuedAt: string        // ISO 8601
  paidAt?: string
  dueAt: string
}

/** Format kobo amount to Naira string: ₦12,500 */
export function formatNaira(kobo: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(kobo / 100)
}
