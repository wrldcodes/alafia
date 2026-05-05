// app/api/patients/me/appointments/route.ts
// Patient views their own appointment history and upcoming bookings.
// GET /api/patients/me/appointments?status=CONFIRMED&upcoming=true

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, withErrorHandler } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth(req);
  requireRole(session, ["PATIENT"]);

  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
  });
  if (!patient)
    return NextResponse.json(
      { error: "Patient profile not found" },
      { status: 404 },
    );

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const upcoming = searchParams.get("upcoming") === "true";

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: patient.id,
      ...(status && { status: status as any }),
      ...(upcoming && {
        slot: { startTime: { gte: new Date() } },
        status: { in: ["PENDING", "CONFIRMED"] },
      }),
    },
    include: {
      clinic: { select: { id: true, name: true, address: true } },
      doctor: { include: { user: { select: { name: true } } } },
      slot: true,
    },
    orderBy: { slot: { startTime: upcoming ? "asc" : "desc" } },
  });

  return NextResponse.json({ appointments, count: appointments.length });
});
