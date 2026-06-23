// app/api/patients/me/appointments/route.ts
// Patient views their own appointment history.
//
// GET /api/patients/me/appointments
// GET /api/patients/me/appointments?upcoming=true
// GET /api/patients/me/appointments?status=CONFIRMED

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@/lib/generated/prisma/client";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

export const GET = withErrorHandler(async (req: Request) => {
  const session = await requireAuth(req);
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
  const status = searchParams.get("status");
  const upcoming = searchParams.get("upcoming") === "true";

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      ...(status && { status: status as AppointmentStatus }),
      ...(upcoming && {
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: { startTime: { gte: new Date() } },
      }),
    },
    select: {
      id: true,
      status: true,
      reason: true,
      notes: true,
      confirmedAt: true,
      cancelledAt: true,
      completedAt: true,
      createdAt: true,
      clinic: {
        select: {
          id: true,
          clinicName: true, // ← clinicName not name
          address: true,
          phone: true,
        },
      },
      doctor: {
        select: {
          specialization: true,
          user: { select: { email: true } },
        },
      },
      slot: {
        select: {
          date: true,
          startTime: true,
          endTime: true,
          duration: true,
        },
      },
    },
    orderBy: {
      slot: { startTime: upcoming ? "asc" : "desc" },
    },
  });

  return NextResponse.json({ appointments, count: appointments.length });
});
