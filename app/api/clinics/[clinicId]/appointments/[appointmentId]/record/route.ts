// app/api/clinics/[clinicId]/appointments/[appointmentId]/record/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";
import {
  createMedicalRecordSchema,
  updateMedicalRecordSchema,
} from "@/lib/validators/medical";

type Params = { params: Promise<{ clinicId: string; appointmentId: string }> };

// GET /api/clinics/:clinicId/appointments/:appointmentId/record
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const record = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            user: { select: { email: true } },
          },
        },
        doctor: {
          select: {
            specialization: true,
            user: { select: { email: true } },
          },
        },
        prescriptions: { orderBy: { createdAt: "asc" } },
        attachments: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            attachmentType: true,
            createdAt: true,
          },
        },
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });

      if (!patient || record.patientId !== patient.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (record.clinicId !== clinicId) {
        return NextResponse.json(
          { error: "Medical record not found" },
          { status: 404 },
        );
      }
    } else {
      requireClinicAccess(session, clinicId);
    }

    if (session.role === "DOCTOR" && record.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ record });
  },
);

// POST /api/clinics/:clinicId/appointments/:appointmentId/record
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
    const parsed = createMedicalRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Fetch appointment directly by id — no status filter
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (appointment.status !== "COMPLETED") {
      return NextResponse.json(
        {
          error:
            "Medical records can only be created for COMPLETED appointments",
          currentStatus: appointment.status,
        },
        { status: 400 },
      );
    }

    if (session.role === "DOCTOR" && appointment.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existing = await prisma.medicalRecord.findUnique({
      where: { appointmentId },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A medical record already exists for this appointment" },
        { status: 409 },
      );
    }

    const {
      chiefComplaint,
      diagnosis,
      symptoms,
      vitalSigns,
      assessment,
      plan,
      followUpDate,
    } = parsed.data;

    const record = await prisma.medicalRecord.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        clinicId,
        doctorId: appointment.doctorId,
        chiefComplaint,
        diagnosis,
        symptoms,
        vitalSigns: vitalSigns ?? undefined,
        assessment,
        plan,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      },
      include: {
        prescriptions: true,
        attachments: true,
      },
    });

    return NextResponse.json({ record }, { status: 201 });
  },
);

// PATCH /api/clinics/:clinicId/appointments/:appointmentId/record
export const PATCH = withErrorHandler(
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
    const parsed = updateMedicalRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const record = await prisma.medicalRecord.findFirst({
      where: { appointmentId },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Medical record not found" },
        { status: 404 },
      );
    }

    if (session.role === "DOCTOR" && record.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { diagnosis, symptoms, vitalSigns, assessment, plan, followUpDate } =
      parsed.data;

    const updated = await prisma.medicalRecord.update({
      where: { id: record.id },
      data: {
        ...(diagnosis !== undefined && { diagnosis }),
        ...(symptoms !== undefined && { symptoms }),
        ...(vitalSigns !== undefined && { vitalSigns }),
        ...(assessment !== undefined && { assessment }),
        ...(plan !== undefined && { plan }),
        ...(followUpDate !== undefined && {
          followUpDate: new Date(followUpDate),
        }),
      },
    });

    return NextResponse.json({ record: updated });
  },
);
