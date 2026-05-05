// app/api/clinics/[clinicId]/appointments/[appointmentId]/route.ts
// GET   — view single appointment
// PATCH — lifecycle transitions (clinic manages status, doctor adds notes)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: { clinicId: string; appointmentId: string } };

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const session = await requireAuth(req);
    requireClinicAccess(session, params.clinicId);

    const appt = await prisma.appointment.findFirst({
      where: { id: params.appointmentId, clinicId: params.clinicId },
      include: {
        patient: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        doctor: { include: { user: { select: { name: true, email: true } } } },
        slot: true,
      },
    });

    if (!appt)
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );

    // Patients can only see their own
    if (session.role === "PATIENT") {
      const patient = await prisma.patient.findUnique({
        where: { userId: session.id },
      });
      if (appt.patientId !== patient?.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ appointment: appt });
  },
);

// PATCH handles four actions via the `action` field in the body:
//   confirm    → CLINIC_ADMIN | CLINIC_STAFF
//   cancel     → CLINIC_ADMIN | CLINIC_STAFF | PATIENT (own appt only)
//   complete   → CLINIC_ADMIN | CLINIC_STAFF | DOCTOR
//   reschedule → CLINIC_ADMIN | CLINIC_STAFF
//   no_show    → CLINIC_ADMIN | CLINIC_STAFF
//   add_notes  → DOCTOR (adds post-visit notes without changing status)
export const PATCH = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const session = await requireAuth(req);
    requireClinicAccess(session, params.clinicId);

    const body = await req.json();
    const { action, cancelReason, notes, newSlotId } = body;

    const appt = await prisma.appointment.findFirst({
      where: { id: params.appointmentId, clinicId: params.clinicId },
      include: { slot: true },
    });
    if (!appt)
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 },
      );

    const clinicRoles = ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"];

    switch (action) {
      case "confirm": {
        requireRole(session, clinicRoles);
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

      case "cancel": {
        // Patients can cancel their own; clinic staff can cancel any
        if (session.role === "PATIENT") {
          const patient = await prisma.patient.findUnique({
            where: { userId: session.id },
          });
          if (appt.patientId !== patient?.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
          }
        } else {
          requireRole(session, clinicRoles);
        }

        if (["CANCELLED", "COMPLETED"].includes(appt.status)) {
          return NextResponse.json(
            { error: "Appointment cannot be cancelled" },
            { status: 400 },
          );
        }

        // Free up the slot
        await prisma.$transaction([
          prisma.timeSlot.update({
            where: { id: appt.slotId },
            data: { status: "AVAILABLE" },
          }),
          prisma.appointment.update({
            where: { id: appt.id },
            data: {
              status: "CANCELLED",
              cancelReason: cancelReason || null,
              cancelledById: session.id,
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
            { error: "Only CONFIRMED appointments can be completed" },
            { status: 400 },
          );
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

      case "no_show": {
        requireRole(session, clinicRoles);
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

      case "reschedule": {
        requireRole(session, clinicRoles);
        if (!newSlotId)
          return NextResponse.json(
            { error: "newSlotId is required to reschedule" },
            { status: 400 },
          );
        if (["CANCELLED", "COMPLETED"].includes(appt.status)) {
          return NextResponse.json(
            { error: "Cannot reschedule a closed appointment" },
            { status: 400 },
          );
        }

        const newAppt = await prisma.$transaction(async (tx) => {
          // Validate and lock new slot
          const newSlot = await tx.timeSlot.findUnique({
            where: { id: newSlotId },
          });
          if (!newSlot || newSlot.status !== "AVAILABLE") {
            throw NextResponse.json(
              { error: "New slot is unavailable" },
              { status: 409 },
            );
          }

          await tx.timeSlot.update({
            where: { id: newSlotId },
            data: { status: "BOOKED" },
          });
          // Release old slot
          await tx.timeSlot.update({
            where: { id: appt.slotId },
            data: { status: "AVAILABLE" },
          });
          // Mark old appointment rescheduled
          await tx.appointment.update({
            where: { id: appt.id },
            data: { status: "RESCHEDULED" },
          });
          // Create new appointment
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
        });

        return NextResponse.json({ appointment: newAppt }, { status: 201 });
      }

      case "add_notes": {
        requireRole(session, ["DOCTOR", ...clinicRoles]);
        if (!notes)
          return NextResponse.json(
            { error: "notes field is required" },
            { status: 400 },
          );
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
