// lib/validators/medical.ts
// Zod schemas for all Phase 2 request bodies.
// Import these in your route handlers.

import { z } from "zod";

// ─── Medical Record ───────────────────────────────────────────────────────

export const createMedicalRecordSchema = z.object({
  chiefComplaint: z.string().min(3, "Chief complaint is required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  symptoms: z
    .array(z.string().min(1))
    .min(1, "At least one symptom is required"),
  vitalSigns: z
    .object({
      bp: z.string().optional(),        // "120/80"
      temp: z.string().optional(),      // "37.2"
      pulse: z.number().int().optional(),
      weight: z.number().optional(),    // kg
      height: z.number().optional(),    // cm
      spO2: z.string().optional(),      // "98%"
    })
    .optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  followUpDate: z.string().datetime().optional(), // ISO string
});

export const updateMedicalRecordSchema = z.object({
  diagnosis: z.string().min(3).optional(),
  symptoms: z.array(z.string().min(1)).optional(),
  vitalSigns: z
    .object({
      bp: z.string().optional(),
      temp: z.string().optional(),
      pulse: z.number().int().optional(),
      weight: z.number().optional(),
      height: z.number().optional(),
      spO2: z.string().optional(),
    })
    .optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  followUpDate: z.string().datetime().optional(),
});

// ─── Prescription ─────────────────────────────────────────────────────────

export const createPrescriptionSchema = z.object({
  drugName: z.string().min(1, "Drug name is required"),
  dosage: z.string().min(1, "Dosage is required"),         // "500mg"
  frequency: z.string().min(1, "Frequency is required"),   // "Twice daily"
  duration: z.string().min(1, "Duration is required"),     // "7 days"
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  instructions: z.string().optional(),
});

export const createPrescriptionsSchema = z.object({
  prescriptions: z
    .array(createPrescriptionSchema)
    .min(1, "At least one prescription is required"),
});

export const updatePrescriptionSchema = z.object({
  drugName: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  frequency: z.string().min(1).optional(),
  duration: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  instructions: z.string().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

// ─── Attachment ───────────────────────────────────────────────────────────

export const attachmentTypeSchema = z.enum([
  "LAB_RESULT",
  "SCAN",
  "XRAY",
  "PRESCRIPTION_SCAN",
  "REFERRAL_LETTER",
  "OTHER",
]);

// Used after Cloudinary upload — client sends back Cloudinary metadata
export const createAttachmentSchema = z.object({
  cloudinaryId: z.string().min(1, "Cloudinary ID is required"),
  url: z.string().url("Must be a valid URL"),
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().int().positive("File size must be positive"),
  attachmentType: attachmentTypeSchema.default("OTHER"),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>;
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>;
export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>;
export type CreatePrescriptionsInput = z.infer<typeof createPrescriptionsSchema>;
export type UpdatePrescriptionInput = z.infer<typeof updatePrescriptionSchema>;
export type CreateAttachmentInput = z.infer<typeof createAttachmentSchema>;
