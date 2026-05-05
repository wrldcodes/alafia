// app/api/clinics/[clinicId]/appointments/route.ts
// GET  /api/clinics/:clinicId/appointments   — clinic views all appointments
//      ?status=PENDING&doctorId=xxx&date=YYYY-MM-DD  (all optional filters)
// POST /api/clinics/:clinicId/appointments   — patient books an appointment

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: { clinicId: string } };

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const session = await requireAuth(req);
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    requireClinicAccess(session, params.clinicId);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const doctorId = searchParams.get("doctorId");
    const dateStr = searchParams.get("date");

    // Doctors only see their own appointments
    const effectiveDoctorId =
      session.role === "DOCTOR"
        ? (
            await prisma.clinicStaff.findUnique({
              where: { userId: session.id },
            })
          )?.id
        : doctorId || undefined;

    const appointments = await prisma.appointment.findMany({
      where: {
        clinicId: params.clinicId,
        ...(status && { status: status as any }),
        ...(effectiveDoctorId && { doctorId: effectiveDoctorId }),
        ...(dateStr && { slot: { date: new Date(dateStr) } }),
      },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        doctor: { include: { user: { select: { name: true, email: true } } } },
        slot: true,
      },
      orderBy: { slot: { startTime: "asc" } },
    });

    return NextResponse.json({ appointments, count: appointments.length });
  },
);

// Patient books an appointment
export const POST = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const session = await requireAuth(req);
    // Patients book. Clinic staff can also book on behalf of a patient.
    requireRole(session, [
      "PATIENT",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "SUPER_ADMIN",
    ]);

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
        where: { userId: session.id },
      });
      if (patient?.id !== patientId) {
        return NextResponse.json(
          { error: "Patients can only book for themselves" },
          { status: 403 },
        );
      }
    }

    // Use a transaction to atomically check slot + create appointment
    const appointment = await prisma
      .$transaction(async (tx) => {
        const slot = await tx.timeSlot.findUnique({ where: { id: slotId } });

        if (!slot) throw { status: 404, message: "Slot not found" };
        if (slot.clinicId !== params.clinicId)
          throw { status: 400, message: "Slot does not belong to this clinic" };
        if (slot.staffId !== doctorId)
          throw { status: 400, message: "Slot does not belong to this doctor" };
        if (slot.status !== "AVAILABLE")
          throw { status: 409, message: "Slot is no longer available" };

        // Lock the slot
        await tx.timeSlot.update({
          where: { id: slotId },
          data: { status: "BOOKED" },
        });

        return tx.appointment.create({
          data: {
            clinicId: params.clinicId,
            patientId,
            doctorId,
            slotId,
            reason,
            status: "PENDING",
          },
          include: {
            slot: true,
            doctor: { include: { user: { select: { name: true } } } },
          },
        });
      })
      .catch((err) => {
        if (err.status)
          throw NextResponse.json(
            { error: err.message },
            { status: err.status },
          );
        throw err;
      });

    return NextResponse.json({ appointment }, { status: 201 });
  },
);
