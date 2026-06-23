// app/api/patients/me/prescriptions/route.ts
// Patient views all their prescriptions across all visits.
//
// GET /api/patients/me/prescriptions
// GET /api/patients/me/prescriptions?status=ACTIVE

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PrescriptionStatus } from "@/lib/generated/prisma/client";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth();
  requireRole(session, ["PATIENT"]);

  const patient = await prisma.patient.findUnique({
    where: { userId: session.userId },
  });

  if (!patient) {
    return NextResponse.json(
      { error: "Patient profile not found" },
      { status: 404 },
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const prescriptions = await prisma.prescription.findMany({
    where: {
      patientId: patient.id,
      ...(status && { status: status as PrescriptionStatus }),
    },
    select: {
      id: true,
      drugName: true,
      dosage: true,
      frequency: true,
      duration: true,
      quantity: true,
      instructions: true,
      status: true,
      createdAt: true,
      record: {
        select: {
          id: true,
          diagnosis: true,
          createdAt: true,
          clinic: { select: { clinicName: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ prescriptions, count: prescriptions.length });
});
