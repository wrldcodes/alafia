// app/api/dashboard/clinic/route.ts
// GET /api/dashboard/clinic
// Returns all aggregate data for the clinic admin dashboard in one request.
// Scoped to the clinic from the session JWT — no clinicId param needed.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, withErrorHandler } from "@/lib/validators/auth";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  subDays,
  format,
} from "date-fns";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth(req);
  requireRole(session, ["CLINIC_ADMIN", "SUPER_ADMIN"]);

  const clinicId = session.clinicId;
  if (!clinicId) {
    return NextResponse.json(
      {
        error: "No clinic associated with this account. Please log in again.",
        code: "NO_CLINIC_IN_TOKEN",
      },
      { status: 403 },
    );
  }

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Run all queries in parallel for performance
  const [
    // ── Appointments today by status ──────────────────────────────────────
    appointmentsToday,

    // ── Total unique patients at this clinic ──────────────────────────────
    totalPatientsAllTime,

    // ── New patients today (first appointment at this clinic today) ───────
    newPatientsToday,

    // ── Medical records created this week ─────────────────────────────────
    medicalRecordsThisWeek,

    // ── Appointment trend — last 7 days ───────────────────────────────────
    last7DaysAppointments,

    // ── Upcoming appointments today (list) ────────────────────────────────
    upcomingToday,

    // ── Active doctors count ──────────────────────────────────────────────
    activeDoctors,

    // ── Total staff count ─────────────────────────────────────────────────
    totalStaff,

  ] = await Promise.all([

    // Appointments today grouped by status
    prisma.appointment.groupBy({
      by: ["status"],
      where: {
        clinicId,
        slot: { date: { gte: todayStart, lte: todayEnd } },
      },
      _count: { status: true },
    }),

    // Total unique patients ever at this clinic
    prisma.patient.count({
      where: { appointments: { some: { clinicId } } },
    }),

    // New patients today — first ever appointment at this clinic today
    prisma.patient.count({
      where: {
        appointments: {
          some: {
            clinicId,
            slot: { date: { gte: todayStart, lte: todayEnd } },
          },
        },
        // only count patients whose FIRST appointment at this clinic is today
        NOT: {
          appointments: {
            some: {
              clinicId,
              slot: { date: { lt: todayStart } },
            },
          },
        },
      },
    }),

    // Medical records created this week
    prisma.medicalRecord.count({
      where: {
        clinicId,
        createdAt: { gte: weekStart, lte: weekEnd },
      },
    }),

    // Last 7 days — daily appointment counts for trend chart
    prisma.appointment.findMany({
      where: {
        clinicId,
        slot: {
          date: {
            gte: startOfDay(subDays(now, 6)),
            lte: todayEnd,
          },
        },
      },
      select: {
        status: true,
        slot: { select: { date: true } },
      },
    }),

    // Upcoming appointments today — detailed list
    prisma.appointment.findMany({
      where: {
        clinicId,
        status: { in: ["PENDING", "CONFIRMED"] },
        slot: {
          date: { gte: todayStart, lte: todayEnd },
          startTime: { gte: now }, // only future slots
        },
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
        doctor: {
          select: {
            specialization: true,
            user: { select: { email: true } },
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
      take: 10,
    }),

    // Active doctors
    prisma.clinicStaff.count({
      where: { clinicId, role: "DOCTOR", isActive: true },
    }),

    // Total active staff
    prisma.clinicStaff.count({
      where: { clinicId, isActive: true },
    }),

  ]);

  // ── Process appointments today by status ──────────────────────────────
  const statusCounts = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    NO_SHOW: 0,
    RESCHEDULED: 0,
  } as Record<string, number>;

  for (const g of appointmentsToday) {
    statusCounts[g.status] = g._count.status;
  }

  const totalAppointmentsToday = Object.values(statusCounts).reduce(
    (a, b) => a + b,
    0
  );

  // ── Build 7-day trend data for chart ─────────────────────────────────
  // Create a map of date → count
  const trendMap: Record<string, { date: string; total: number; completed: number; cancelled: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    const key = format(d, "yyyy-MM-dd");
    trendMap[key] = {
      date: format(d, "EEE dd"), // "Mon 01"
      total: 0,
      completed: 0,
      cancelled: 0,
    };
  }

  for (const appt of last7DaysAppointments) {
    const key = format(new Date(appt.slot.date), "yyyy-MM-dd");
    if (trendMap[key]) {
      trendMap[key].total++;
      if (appt.status === "COMPLETED") trendMap[key].completed++;
      if (appt.status === "CANCELLED") trendMap[key].cancelled++;
    }
  }

  const appointmentTrend = Object.values(trendMap);

  // ── Appointment status breakdown for pie chart ───────────────────────
  const statusBreakdown = Object.entries(statusCounts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({ status, count }));

  return NextResponse.json({
    // Stat cards
    stats: {
      totalAppointmentsToday,
      appointmentsByStatus: statusCounts,
      newPatientsToday,
      totalPatientsAllTime,
      medicalRecordsThisWeek,
      activeDoctors,
      totalStaff,
      revenueToday: null, // placeholder until Phase 3 billing
    },
    // Charts
    charts: {
      appointmentTrend,      // bar/line chart — last 7 days
      statusBreakdown,       // pie/donut chart — today's status split
    },
    // Lists
    lists: {
      upcomingToday,
    },
    meta: {
      generatedAt: now.toISOString(),
      clinicId,
    },
  });
});
