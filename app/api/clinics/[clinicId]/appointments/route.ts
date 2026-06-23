// app/api/clinics/[clinicId]/appointments/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/lib/generated/prisma/client";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";

type Params = { params: Promise<{ clinicId: string }> };

// GET /api/clinics/:clinicId/appointments
// ?status=PENDING  ?doctorId=xxx  ?date=YYYY-MM-DD  (all optional)
// Doctors only see their own appointments
export const GET = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const { clinicId } = await params;
    const session = await requireAuth(req);
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    await requireClinicAccess(session, clinicId);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const doctorId = searchParams.get("doctorId");
    const dateStr = searchParams.get("date");

    // Doctors are scoped to their own staffId from the JWT
    const effectiveDoctorId =
      session.role === "DOCTOR" ? session.staffId : doctorId || undefined;

    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId,
        ...(status && { status: status as AppointmentStatus }),
        ...(effectiveDoctorId && { doctorId: effectiveDoctorId }),
        ...(dateStr && { slot: { date: new Date(dateStr) } }),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            user: { select: { email: true } },
          },
        },
        doctor: {
          select: {
            id: true,
            specialization: true,
            user: { select: { email: true } },
          },
        },
        slot: true,
      },
      orderBy: { slot: { startTime: "asc" } },
    });

    return NextResponse.json({ appointments, count: appointments.length });
  },
);

// POST /api/clinics/:clinicId/appointments
// Patients book. Clinic staff can book on behalf of a patient.
// Body: { patientId, doctorId, slotId, reason }
export const POST = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const { clinicId } = await params;
    const session = await requireAuth(req);
    requireRole(session, [
      "PATIENT",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "SUPER_ADMIN",
    ]);

    if (session.role !== "PATIENT") {
      await requireClinicAccess(session, clinicId);
    }

    const body = await req.json();
    const { patientId, doctorId, slotId, reason } = body;

    if (!patientId || !doctorId || !slotId || !reason) {
      return NextResponse.json(
        { error: "patientId, doctorId, slotId and reason are required" },
        { status: 400 },
      );
    }

    // Patients can only book for themselves
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (patient?.id !== patientId) {
        return NextResponse.json(
          { error: "Patients can only book for themselves" },
          { status: 403 },
        );
      }
    }

    // Atomically check slot availability and create appointment
    const appointment = await prisma
      .$transaction(async (tx) => {
        const slot = await tx.timeSlot.findUnique({ where: { id: slotId } });

        if (!slot) {
          throw { status: 404, message: "Slot not found" };
        }
        if (slot.clinicId !== clinicId) {
          throw { status: 403, message: "Slot does not belong to this clinic" };
        }
        if (slot.staffId !== doctorId) {
          throw { status: 400, message: "Slot does not belong to this doctor" };
        }
        if (slot.status !== "AVAILABLE") {
          throw { status: 409, message: "Slot is no longer available" };
        }

        await tx.timeSlot.update({
          where: { id: slotId },
          data: { status: "BOOKED" },
        });

        return tx.appointment.create({
          data: {
            clinicId: slot.clinicId,
            patientId,
            doctorId,
            slotId,
            reason,
            status: "PENDING",
          },
          include: {
            slot: true,
            doctor: {
              select: {
                specialization: true,
                user: { select: { email: true } },
              },
            },
          },
        });
      })
      .catch((err) => {
        if (err.status) {
          throw NextResponse.json(
            { error: err.message },
            { status: err.status },
          );
        }
        throw err;
      });

    return NextResponse.json({ appointment }, { status: 201 });
  },
);
