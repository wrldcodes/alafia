// Clinic admin/staff sets and retrieves a doctor's weekly schedule.
// Doctors do not touch this — the clinic controls availability.
//
// GET /api/clinics/:clinicId/staff/:staffId/working-hours
// PUT /api/clinics/:clinicId/staff/:staffId/working-hours

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: { clinicId: string; staffId: string } };

export const GET = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const session = await requireAuth();
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    requireClinicAccess(session, params.clinicId);

    const hours = await prisma.workingHours.findMany({
      where: { staffId: params.staffId, clinicId: params.clinicId },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ workingHours: hours });
  },
);

// Body: { schedule: [{ dayOfWeek: 1, startTime: "08:00", endTime: "17:00", isActive: true }] }
// dayOfWeek: 0 = Sunday … 6 = Saturday
export const PUT = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const session = await requireAuth();
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
    requireClinicAccess(session, params.clinicId);

    const { schedule } = await req.json();

    if (!Array.isArray(schedule) || schedule.length === 0) {
      return NextResponse.json(
        { error: "schedule array is required" },
        { status: 400 },
      );
    }

    for (const entry of schedule) {
      if (
        typeof entry.dayOfWeek !== "number" ||
        entry.dayOfWeek < 0 ||
        entry.dayOfWeek > 6
      ) {
        return NextResponse.json(
          { error: "dayOfWeek must be 0 (Sun) – 6 (Sat)" },
          { status: 400 },
        );
      }
      if (!entry.startTime || !entry.endTime) {
        return NextResponse.json(
          { error: "startTime and endTime required for each day" },
          { status: 400 },
        );
      }
    }

    const results = await prisma.$transaction(
      schedule.map(
        (entry: {
          dayOfWeek: number;
          startTime: string;
          endTime: string;
          isActive?: boolean;
        }) =>
          prisma.workingHours.upsert({
            where: {
              staffId_dayOfWeek: {
                staffId: params.staffId,
                dayOfWeek: entry.dayOfWeek,
              },
            },
            update: {
              startTime: entry.startTime,
              endTime: entry.endTime,
              isActive: entry.isActive ?? true,
            },
            create: {
              staffId: params.staffId,
              clinicId: params.clinicId,
              dayOfWeek: entry.dayOfWeek,
              startTime: entry.startTime,
              endTime: entry.endTime,
              isActive: entry.isActive ?? true,
            },
          }),
      ),
    );

    return NextResponse.json({ workingHours: results });
  },
);
