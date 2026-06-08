// app/api/dashboard/patient/route.ts
// GET /api/dashboard/patient
// Returns the patient's personal health summary dashboard.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth(req);
  requireRole(session, ["PATIENT"]);

  const now = new Date();

  const patient = await prisma.patient.findUnique({
    where: { userId: session.userId },
  });

  if (!patient) {
    return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
  }

  const [
    nextAppointment,
    totalVisits,
    activePrescriptions,
    recentRecords,
    upcomingAppointments,
  ] = await Promise.all([

    // Next upcoming appointment
    prisma.appointment.findFirst({
      where: {
        patientId: patient.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: { startTime: { gte: now } },
      },
      select: {
        id: true,
        status: true,
        reason: true,
        clinic: { select: { clinicName: true, address: true, phone: true } },
        doctor: {
          select: {
            specialization: true,
            user: { select: { email: true } },
          },
        },
        slot: { select: { date: true, startTime: true, endTime: true } },
      },
      orderBy: { slot: { startTime: "asc" } },
    }),

    // Total completed visits
    prisma.appointment.count({
      where: { patientId: patient.id, status: "COMPLETED" },
    }),

    // Active prescriptions count
    prisma.prescription.count({
      where: { patientId: patient.id, status: "ACTIVE" },
    }),

    // Recent medical records (last 3)
    prisma.medicalRecord.findMany({
      where: { patientId: patient.id },
      select: {
        id: true,
        diagnosis: true,
        chiefComplaint: true,
        createdAt: true,
        clinic: { select: { clinicName: true } },
        doctor: {
          select: {
            specialization: true,
            user: { select: { email: true } },
          },
        },
        _count: { select: { prescriptions: true, attachments: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    // All upcoming appointments
    prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: { startTime: { gte: now } },
      },
      select: {
        id: true,
        status: true,
        reason: true,
        clinic: { select: { clinicName: true } },
        doctor: {
          select: {
            specialization: true,
            user: { select: { email: true } },
          },
        },
        slot: { select: { date: true, startTime: true, endTime: true } },
      },
      orderBy: { slot: { startTime: "asc" } },
      take: 5,
    }),

  ]);

  return NextResponse.json({
    stats: {
      totalVisits,
      activePrescriptions,
      upcomingAppointmentsCount: upcomingAppointments.length,
      totalRecords: recentRecords.length,
    },
    lists: {
      nextAppointment,
      upcomingAppointments,
      recentRecords,
    },
    meta: {
      generatedAt: now.toISOString(),
      patientId: patient.id,
    },
  });
});
