// app/api/patients/me/records/route.ts
// Patient views their full medical history across all clinics.
//
// GET /api/patients/me/records
// GET /api/patients/me/records?clinicId=xxx

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
  const clinicId = searchParams.get("clinicId");

  const records = await prisma.medicalRecord.findMany({
    where: {
      patientId: patient.id,
      ...(clinicId && { clinicId }),
    },
    select: {
      id: true,
      chiefComplaint: true,
      diagnosis: true,
      symptoms: true,
      assessment: true,
      plan: true,
      followUpDate: true,
      createdAt: true,
      clinic: {
        select: { id: true, clinicName: true, address: true },
      },
      doctor: {
        select: {
          specialization: true,
          user: { select: { email: true } },
        },
      },
      appointment: {
        select: {
          slot: { select: { date: true, startTime: true } },
        },
      },
      prescriptions: {
        select: {
          id: true,
          drugName: true,
          dosage: true,
          frequency: true,
          duration: true,
          status: true,
        },
      },
      // Attachment count only — patient must request signed URL separately
      _count: { select: { attachments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ records, count: records.length });
});
