// app/api/clinics/[clinicId]/appointments/[appointmentId]/record/prescriptions/[prescriptionId]/route.ts
//
// GET    → view single prescription
// PATCH  → update or cancel a prescription
// DELETE → hard delete (admin only — e.g. issued in error)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";
import { updatePrescriptionSchema } from "@/lib/validators/medical";

type Params = {
  params: Promise<{
    clinicId: string;
    appointmentId: string;
    prescriptionId: string;
  }>;
};

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, prescriptionId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { record: { select: { appointmentId: true, patientId: true } } },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 },
      );
    }

    // Patient can only view their own
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (prescription.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ prescription });
  },
);

export const PATCH = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, prescriptionId } = await params;
    const session = await requireAuth(req);
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    requireClinicAccess(session, clinicId);

    const body = await req.json();
    const parsed = updatePrescriptionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: { record: true },
    });

    if (!prescription) {
      return NextResponse.json(
        { error: "Prescription not found" },
        { status: 404 },
      );
    }

    // Doctors can only update prescriptions on their own records
    if (
      session.role === "DOCTOR" &&
      prescription.record.doctorId !== session.staffId
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: parsed.data,
    });

    return NextResponse.json({ prescription: updated });
  },
);

export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, prescriptionId } = await params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN"]);
    requireClinicAccess(session, clinicId);

    await prisma.prescription.delete({ where: { id: prescriptionId } });
    return NextResponse.json({ message: "Prescription deleted" });
  },
);
