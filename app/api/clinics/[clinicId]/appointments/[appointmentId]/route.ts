// app/api/clinics/[clinicId]/appointments/[appointmentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";

type Params = { params: Promise<{ clinicId: string; appointmentId: string }> };

// GET /api/clinics/:clinicId/appointments/:appointmentId
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const appt = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
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
    });

    if (!appt) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (appt.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (session.role === "DOCTOR" && appt.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ appointment: appt });
  },
);

// PATCH /api/clinics/:clinicId/appointments/:appointmentId
export const PATCH = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, appointmentId } = await params;
    const session = await requireAuth(req);
    requireClinicAccess(session, clinicId);

    const body = await req.json();
    const { action, cancelReason, notes, newSlotId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "action field is required" },
        { status: 400 },
      );
    }

    // Fetch appointment without status filter so we always get it
    const appt = await prisma.appointment.findFirst({
      where: { id: appointmentId, clinicId },
      include: { slot: true },
    });

    if (!appt) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );
    }

    const clinicRoles = [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
    ] as const;

    switch (action) {
      case "confirm": {
        requireRole(session, [...clinicRoles]);
        if (appt.status !== "PENDING") {
          return NextResponse.json(
            { error: `Cannot confirm — appointment status is ${appt.status}` },
            { status: 400 },
          );
        }
        const updated = await prisma.appointment.update({
          where: { id: appointmentId }, // no status filter here
          data: { status: "CONFIRMED", confirmedAt: new Date() },
        });
        return NextResponse.json({ appointment: updated });
      }

      case "cancel": {
        if (session.role === "PATIENT") {
          const patient = await prisma.patient.findUnique({
            where: { userId: session.userId },
          });
          if (appt.patientId !== patient?.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
          }
        } else {
          requireRole(session, [...clinicRoles]);
        }

        if (["CANCELLED", "COMPLETED"].includes(appt.status)) {
          return NextResponse.json(
            { error: `Cannot cancel — appointment status is ${appt.status}` },
            { status: 400 },
          );
        }

        await prisma.$transaction([
          prisma.timeSlot.update({
            where: { id: appt.slotId },
            data: { status: "AVAILABLE" },
          }),
          prisma.appointment.update({
            where: { id: appointmentId },
            data: {
              status: "CANCELLED",
              cancelReason: cancelReason ?? null,
              cancelledById: session.userId,
              cancelledAt: new Date(),
            },
          }),
        ]);

        return NextResponse.json({ message: "Appointment cancelled" });
      }

      case "complete": {
        requireRole(session, [...clinicRoles, "DOCTOR"]);
        if (appt.status !== "CONFIRMED") {
          return NextResponse.json(
            { error: `Cannot complete — appointment status is ${appt.status}` },
            { status: 400 },
          );
        }
        if (session.role === "DOCTOR" && appt.doctorId !== session.staffId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const updated = await prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            ...(notes && { notes }),
          },
        });
        return NextResponse.json({ appointment: updated });
      }

      case "no_show": {
        requireRole(session, [...clinicRoles]);
        if (appt.status !== "CONFIRMED") {
          return NextResponse.json(
            {
              error: `Cannot mark no-show — appointment status is ${appt.status}`,
            },
            { status: 400 },
          );
        }
        const updated = await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: "NO_SHOW" },
        });
        return NextResponse.json({ appointment: updated });
      }

      case "reschedule": {
        requireRole(session, [...clinicRoles]);
        if (!newSlotId) {
          return NextResponse.json(
            { error: "newSlotId is required for reschedule" },
            { status: 400 },
          );
        }
        if (["CANCELLED", "COMPLETED", "NO_SHOW"].includes(appt.status)) {
          return NextResponse.json(
            {
              error: `Cannot reschedule — appointment status is ${appt.status}`,
            },
            { status: 400 },
          );
        }

        const newAppt = await prisma
          .$transaction(async (tx) => {
            const newSlot = await tx.timeSlot.findUnique({
              where: { id: newSlotId },
            });
            if (!newSlot) throw { status: 404, message: "New slot not found" };
            if (newSlot.clinicId !== clinicId)
              throw {
                status: 400,
                message: "Slot does not belong to this clinic",
              };
            if (newSlot.status !== "AVAILABLE")
              throw { status: 409, message: "New slot is no longer available" };

            await tx.timeSlot.update({
              where: { id: newSlotId },
              data: { status: "BOOKED" },
            });
            await tx.timeSlot.update({
              where: { id: appt.slotId },
              data: { status: "AVAILABLE" },
            });
            await tx.appointment.update({
              where: { id: appointmentId },
              data: { status: "RESCHEDULED" },
            });

            return tx.appointment.create({
              data: {
                clinicId,
                patientId: appt.patientId,
                doctorId: appt.doctorId,
                slotId: newSlotId,
                reason: appt.reason,
                status: "CONFIRMED",
                confirmedAt: new Date(),
                rescheduledFromId: appointmentId,
              },
              include: { slot: true },
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

        return NextResponse.json({ appointment: newAppt }, { status: 201 });
      }

      case "add_notes": {
        requireRole(session, [...clinicRoles, "DOCTOR"]);
        if (!notes) {
          return NextResponse.json(
            { error: "notes field is required" },
            { status: 400 },
          );
        }
        if (session.role === "DOCTOR" && appt.doctorId !== session.staffId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const updated = await prisma.appointment.update({
          where: { id: appointmentId },
          data: { notes },
        });
        return NextResponse.json({ appointment: updated });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use: confirm | cancel | complete | no_show | reschedule | add_notes",
          },
          { status: 400 },
        );
    }
  },
);
