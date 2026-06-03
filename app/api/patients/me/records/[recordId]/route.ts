// app/api/patients/me/records/[recordId]/route.ts
// Patient views a single medical record in full detail.
//
// GET /api/patients/me/records/:recordId

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

type Params = { params: { recordId: string } };

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
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

    const record = await prisma.medicalRecord.findFirst({
      where: {
        id: params.recordId,
        patientId: patient.id, // enforces ownership
      },
      select: {
        id: true,
        chiefComplaint: true,
        diagnosis: true,
        symptoms: true,
        vitalSigns: true,
        assessment: true,
        plan: true,
        followUpDate: true,
        createdAt: true,
        clinic: {
          select: { id: true, clinicName: true, address: true, phone: true },
        },
        doctor: {
          select: {
            specialization: true,
            qualifications: true,
            user: { select: { email: true } },
          },
        },
        appointment: {
          select: {
            reason: true,
            slot: { select: { date: true, startTime: true, endTime: true } },
          },
        },
        prescriptions: {
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
          },
          orderBy: { createdAt: "asc" },
        },
        // Attachment metadata only — no Cloudinary URLs
        attachments: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            attachmentType: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!record) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ record });
  },
);
