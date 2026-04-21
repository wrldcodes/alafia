import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import jwt from "jsonwebtoken";
import type { CookieResponse } from "@/types";

export const generateToken = (userId: string, res: CookieResponse): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn =
    (process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] | undefined) ??
    "7d";

  const payload = { id: userId };
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return token;
};

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Generate a random Aláfíà patient ID */
export function generatePatientId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `ALF-${num}`;
}

/** Generate a random Aláfíà clinic ID */
export function generateClinicId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CLN-${num}`;
}

/** Format a Nigerian phone number */
export function formatNigerianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) return `+234 ${cleaned.slice(1)}`;
  if (cleaned.startsWith("234")) return `+${cleaned}`;
  return `+234 ${cleaned}`;
}

/** Format naira currency */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Format a date string to readable form */
export function formatDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/** Get initials from a full name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** All 37 Nigerian states including FCT */
export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT — Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number];

/** Clinic services catalogue */
export const CLINIC_SERVICES = [
  "General consultation",
  "Maternity & antenatal",
  "Child & paediatric care",
  "Immunisation",
  "Emergency care",
  "Surgery",
  "Laboratory & diagnostics",
  "Pharmacy",
  "Mental health",
  "Dental",
  "Eye care",
  "HIV/AIDS care",
  "Malaria treatment",
  "Diabetes care",
  "Physiotherapy",
  "X-ray & imaging",
] as const;

/** Insurance providers */
export const INSURANCE_PROVIDERS = [
  "NHIS",
  "HMO",
  "PHIS",
  "Hygeia",
  "Reliance HMO",
  "Out-of-pocket only",
] as const;

/** Languages spoken */
export const LANGUAGES = [
  "English",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Pidgin",
  "French",
] as const;
