import { z } from "zod";

export const roleSchema = z.enum(["PATIENT", "CLINIC_ADMIN"]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const patientRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().optional(), // ISO string e.g "1995-04-12"
  phone: z.string().optional(),
});

export const clinicRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  clinicName: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  licenseNumber: z.string().optional(),
});
