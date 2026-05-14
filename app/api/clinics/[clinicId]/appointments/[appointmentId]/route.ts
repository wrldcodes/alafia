// app/api/clinics/[clinicId]/appointments/[appointmentId]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: { clinicId: string; appointmentId: string } };

// GET /api/clinics/:clinicId/appointments/:appointmentId
export const GET = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const session = await requireAuth(req);
    await requireClinicAccess(session, params.clinicId);

    const appt = await prisma.appointment.findFirst({
      where: { id: params.appointmentId, clinicId: params.clinicId },
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

    // Patients can only view their own appointments
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.userId },
      });
      if (appt.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Doctors can only view their own appointments
    if (session.role === "DOCTOR" && appt.doctorId !== session.staffId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ appointment: appt });
  },
);

// PATCH /api/clinics/:clinicId/appointments/:appointmentId
// Single endpoint for all lifecycle transitions via `action` field.
//
// { "action": "confirm" }
// { "action": "cancel", "cancelReason": "Patient request" }
// { "action": "complete", "notes": "Prescribed paracetamol" }
// { "action": "no_show" }
// { "action": "reschedule", "newSlotId": "clx..." }
// { "action": "add_notes", "notes": "Follow up in 2 weeks" }
export const PATCH = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const session = await requireAuth(req);
    await requireClinicAccess(session, params.clinicId);

    const body = await req.json();
    const { action, cancelReason, notes, newSlotId } = body;

    if (!action) {
      return NextResponse.json(
        { error: "action field is required" },
        { status: 400 },
      );
    }

    const appt = await prisma.appointment.findFirst({
      where: { id: params.appointmentId, clinicId: params.clinicId },
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
      // ── confirm ─────────────────────────────────────────────────────────
      case "confirm": {
        requireRole(session, [...clinicRoles]);
        if (appt.status !== "PENDING") {
          return NextResponse.json(
            { error: "Only PENDING appointments can be confirmed" },
            { status: 400 },
          );
        }
        const updated = await prisma.appointment.update({
          where: { id: appt.id },
          data: { status: "CONFIRMED", confirmedAt: new Date() },
        });
        return NextResponse.json({ appointment: updated });
      }

      // ── cancel ──────────────────────────────────────────────────────────
      case "cancel": {
        // Patients can cancel their own; clinic staff can cancel any
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
            { error: "This appointment cannot be cancelled" },
            { status: 400 },
          );
        }

        // Free the slot back to AVAILABLE
        await prisma.$transaction([
          prisma.timeSlot.update({
            where: { id: appt.slotId },
            data: { status: "AVAILABLE" },
          }),
          prisma.appointment.update({
            where: { id: appt.id },
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

      // ── complete ─────────────────────────────────────────────────────────
      case "complete": {
        requireRole(session, [...clinicRoles, "DOCTOR"]);
        if (appt.status !== "CONFIRMED") {
          return NextResponse.json(
            { error: "Only CONFIRMED appointments can be marked complete" },
            { status: 400 },
          );
        }
        // Doctors can only complete their own appointments
        if (session.role === "DOCTOR" && appt.doctorId !== session.staffId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const updated = await prisma.appointment.update({
          where: { id: appt.id },
          data: {
            status: "COMPLETED",
            completedAt: new Date(),
            ...(notes && { notes }),
          },
        });
        return NextResponse.json({ appointment: updated });
      }

      // ── no_show ──────────────────────────────────────────────────────────
      case "no_show": {
        requireRole(session, [...clinicRoles]);
        if (appt.status !== "CONFIRMED") {
          return NextResponse.json(
            { error: "Only CONFIRMED appointments can be marked no-show" },
            { status: 400 },
          );
        }
        const updated = await prisma.appointment.update({
          where: { id: appt.id },
          data: { status: "NO_SHOW" },
        });
        return NextResponse.json({ appointment: updated });
      }

      // ── reschedule ───────────────────────────────────────────────────────
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
            { error: "Cannot reschedule a closed appointment" },
            { status: 400 },
          );
        }

        const newAppt = await prisma
          .$transaction(async (tx) => {
            const newSlot = await tx.timeSlot.findUnique({
              where: { id: newSlotId },
            });

            if (!newSlot) {
              throw { status: 404, message: "New slot not found" };
            }
            if (newSlot.clinicId !== params.clinicId) {
              throw {
                status: 400,
                message: "Slot does not belong to this clinic",
              };
            }
            if (newSlot.status !== "AVAILABLE") {
              throw { status: 409, message: "New slot is no longer available" };
            }

            // Lock new slot
            await tx.timeSlot.update({
              where: { id: newSlotId },
              data: { status: "BOOKED" },
            });

            // Release old slot
            await tx.timeSlot.update({
              where: { id: appt.slotId },
              data: { status: "AVAILABLE" },
            });

            // Mark old appointment as rescheduled
            await tx.appointment.update({
              where: { id: appt.id },
              data: { status: "RESCHEDULED" },
            });

            // Create the new appointment (confirmed immediately)
            return tx.appointment.create({
              data: {
                clinicId: appt.clinicId,
                patientId: appt.patientId,
                doctorId: appt.doctorId,
                slotId: newSlotId,
                reason: appt.reason,
                status: "CONFIRMED",
                confirmedAt: new Date(),
                rescheduledFromId: appt.id,
              },
              include: { slot: true },
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

        return NextResponse.json({ appointment: newAppt }, { status: 201 });
      }

      // ── add_notes ────────────────────────────────────────────────────────
      case "add_notes": {
        requireRole(session, [...clinicRoles, "DOCTOR"]);
        if (!notes) {
          return NextResponse.json(
            { error: "notes field is required" },
            { status: 400 },
          );
        }
        // Doctors can only add notes to their own appointments
        if (session.role === "DOCTOR" && appt.doctorId !== session.staffId) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const updated = await prisma.appointment.update({
          where: { id: appt.id },
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
