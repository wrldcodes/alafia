// app/api/dashboard/doctor/route.ts
// GET /api/dashboard/doctor
// Returns the doctor's personal operational dashboard data.
// Scoped to the doctor from the session JWT — no params needed.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, withErrorHandler } from "@/lib/validators/auth";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth(req);
  requireRole(session, ["DOCTOR"]);

  const staffId = session.staffId!;
  const clinicId = session.clinicId!;
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [
    // Today's full schedule
    todaySchedule,

    // Appointment counts today
    todayStatusCounts,

    // Patients seen this week
    patientsThisWeek,

    // Medical records created this week by this doctor
    recordsThisWeek,

    // Next appointment
    nextAppointment,

  ] = await Promise.all([

    // Full schedule for today ordered by time
    prisma.appointment.findMany({
      where: {
        doctorId: staffId,
        clinicId,
        slot: { date: { gte: todayStart, lte: todayEnd } },
      },
      select: {
        id: true,
        status: true,
        reason: true,
        notes: true,
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            dateOfBirth: true,
          },
        },
        slot: {
          select: {
            startTime: true,
            endTime: true,
            duration: true,
          },
        },
      },
      orderBy: { slot: { startTime: "asc" } },
    }),

    // Today's appointments by status
    prisma.appointment.groupBy({
      by: ["status"],
      where: {
        doctorId: staffId,
        clinicId,
        slot: { date: { gte: todayStart, lte: todayEnd } },
      },
      _count: { status: true },
    }),

    // Unique patients seen this week (completed appointments)
    prisma.appointment.findMany({
      where: {
        doctorId: staffId,
        clinicId,
        status: "COMPLETED",
        slot: { date: { gte: weekStart, lte: weekEnd } },
      },
      select: { patientId: true },
      distinct: ["patientId"],
    }),

    // Medical records created this week
    prisma.medicalRecord.count({
      where: {
        doctorId: staffId,
        clinicId,
        createdAt: { gte: weekStart, lte: weekEnd },
      },
    }),

    // Next upcoming appointment
    prisma.appointment.findFirst({
      where: {
        doctorId: staffId,
        clinicId,
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: { startTime: { gte: now } },
      },
      select: {
        id: true,
        status: true,
        reason: true,
        patient: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        slot: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
      orderBy: { slot: { startTime: "asc" } },
    }),

  ]);

  // Process status counts
  const statusCounts = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    NO_SHOW: 0,
  } as Record<string, number>;

  for (const g of todayStatusCounts) {
    statusCounts[g.status] = g._count.status;
  }

  return NextResponse.json({
    stats: {
      totalAppointmentsToday: Object.values(statusCounts).reduce((a, b) => a + b, 0),
      appointmentsByStatus: statusCounts,
      patientsSeenThisWeek: patientsThisWeek.length,
      recordsCreatedThisWeek: recordsThisWeek,
    },
    lists: {
      todaySchedule,
      nextAppointment,
    },
    meta: {
      generatedAt: now.toISOString(),
      staffId,
      clinicId,
    },
  });
});
