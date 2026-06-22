// app/api/patients/me/appointments/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
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
      // filter by status if provided
      ...(status && { status: status as AppointmentStatus }),
      // upcoming: slot is in the future AND appointment is active
      ...(upcoming && {
        slot: { startTime: { gte: new Date() } },
        status: { in: ["PENDING", "CONFIRMED"] },
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
          clinicName: true,
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
      createdAt: upcoming ? "asc" : "desc",
    },
  });

  return NextResponse.json({ appointments, count: appointments.length });
});
