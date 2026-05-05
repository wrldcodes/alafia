import "server-only";

import { prisma } from "@/lib/prisma";
import { signToken, type SessionUser } from "@/lib/auth";

export type UserRole = "PATIENT" | "CLINIC";

export type ClinicRegisterData = {
  clinicName: string;
  address?: string;
  phone?: string;
  licenseNumber?: string;
};

export type PatientRegisterData = {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
};

export async function createPatientUser(
  email: string,
  passwordHash: string,
  data: PatientRegisterData,
) {
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "PATIENT",
      patient: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth)
            : undefined,
          phone: data.phone,
        },
      },
    },
  });

  const patient = await prisma.patient.findUnique({
    where: { userId: user.id },
  });

  return { ...user, patient };
}

export async function createClinicUser(
  email: string,
  passwordHash: string,
  data: ClinicRegisterData,
) {
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "CLINIC",
      clinic: {
        create: {
          clinicName: data.clinicName,
          address: data.address,
          phone: data.phone,
          licenseNumber: data.licenseNumber,
        },
      },
    },
  });

  const clinic = await prisma.clinic.findUnique({
    where: { userId: user.id },
  });

  return { ...user, clinic };
}

export async function generateToken(user: SessionUser) {
  return signToken(user);
}
