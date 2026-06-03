// app/api/clinics/[clinicId]/staff/[staffId]/working-hours/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";

type Params = { params: Promise<{ clinicId: string; staffId: string }> };

// GET /api/clinics/:clinicId/staff/:staffId/working-hours
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, staffId } = await params;
    const session = await requireAuth(req);
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    await requireClinicAccess(session, clinicId);

    const hours = await prisma.workingHours.findMany({
      where: { staffId, clinicId },
      orderBy: { dayOfWeek: "asc" },
    });

    return NextResponse.json({ workingHours: hours });
  },
);

// PUT /api/clinics/:clinicId/staff/:staffId/working-hours
// Body: { schedule: [{ dayOfWeek: 1, startTime: "08:00", endTime: "17:00", isActive: true }] }
export const PUT = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, staffId } = await params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
    await requireClinicAccess(session, clinicId);

    const body = await req.json();
    const { schedule } = body;

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
          { error: "dayOfWeek must be 0 (Sun) to 6 (Sat)" },
          { status: 400 },
        );
      }
      if (!entry.startTime || !entry.endTime) {
        return NextResponse.json(
          { error: "startTime and endTime are required for each entry" },
          { status: 400 },
        );
      }
    }

    // Verify this staff member belongs to this clinic
    const staffMember = await prisma.clinicStaff.findFirst({
      where: { id: staffId, clinicId },
    });

    if (!staffMember) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 },
      );
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
                staffId,
                dayOfWeek: entry.dayOfWeek,
              },
            },
            update: {
              startTime: entry.startTime,
              endTime: entry.endTime,
              isActive: entry.isActive ?? true,
            },
            create: {
              staffId,
              clinicId,
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
