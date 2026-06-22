// app/api/clinics/[clinicId]/staff/[staffId]/slots/route.ts
// GET  /api/clinics/:clinicId/staff/:staffId/slots?date=YYYY-MM-DD
//      → available slots for a doctor on a date (patients + staff see this)
//
// POST /api/clinics/:clinicId/staff/:staffId/slots/generate
//      → clinic admin generates slots from working hours (see /generate route)
//
// PATCH /api/clinics/:clinicId/staff/:staffId/slots/:slotId
//      → clinic admin blocks/unblocks a specific slot

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  withErrorHandler,
} from "@/lib/validators/auth";

type Params = { params: Promise<{ clinicId: string; staffId: string }> };

// List available slots for a given date
export const GET = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const { clinicId, staffId } = await params;
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json(
        { error: "date query param required (YYYY-MM-DD)" },
        { status: 400 },
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    const slots = await prisma.timeSlot.findMany({
      where: {
        staffId,
        clinicId,
        date,
        status: "AVAILABLE",
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ slots, count: slots.length });
  },
);
