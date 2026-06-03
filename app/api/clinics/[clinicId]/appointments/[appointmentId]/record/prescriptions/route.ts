// app/api/clinics/[clinicId]/appointments/[appointmentId]/record/prescriptions/route.ts
//
// GET  → list all prescriptions on this record
// POST → doctor adds prescriptions (bulk — one or many at once)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";
import { createPrescriptionsSchema } from "@/lib/validators/medical";

type Params = { params: Promise<{ clinicId: string; appointmentId: string }> };

// GET /api/clinics/:clinicId/appointments/:appointmentId/record/prescriptions
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const record = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    // Patients can only view their own
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (record.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { recordId: record.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ prescriptions });
  },
);

// POST /api/clinics/:clinicId/appointments/:appointmentId/record/prescriptions
// Body: { prescriptions: [{ drugName, dosage, frequency, duration, quantity, instructions? }] }
// Accepts an array so doctor can issue multiple drugs in one request
export const POST = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    requireClinicAccess(session, clinicId);

    const body = await req.json();
    const parsed = createPrescriptionsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const record = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    // Doctors can only prescribe on their own records
    if (session.role === "DOCTOR" && record.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prescriptions = await prisma.$transaction(
      parsed.data.prescriptions.map((p) =>
        prisma.prescription.create({
          data: {
            recordId: record.id,
            patientId: record.patientId,
            drugName: p.drugName,
            dosage: p.dosage,
            frequency: p.frequency,
            duration: p.duration,
            quantity: p.quantity,
            instructions: p.instructions,
          },
        }),
      ),
    );

    return NextResponse.json({ prescriptions }, { status: 201 });
  },
);
