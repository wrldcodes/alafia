// app/api/debug/session/route.ts
// TEMPORARY — delete this before production
// Hit GET /api/debug/session with your cookie to see exactly what's in your JWT

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/validators/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSession(req);

  if (!session) {
    return NextResponse.json(
      { error: "No session / cookie not found" },
      { status: 401 },
    );
  }

  // Also fetch what's actually in the DB so you can compare
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      clinic: { select: { id: true, clinicName: true } },
      clinicStaff: { select: { id: true, clinicId: true, role: true } },
      patient: { select: { id: true } },
    },
  });

  return NextResponse.json({
    // What the JWT says
    jwt_payload: {
      userId: session.userId,
      email: session.email,
      role: session.role,
      clinicId: session.clinicId, // <-- this must match your URL param
      staffId: session.staffId,
    },
    // What the DB actually has
    db_user: {
      id: user?.id,
      role: user?.role,
      clinic: user?.clinic, // populated if CLINIC_ADMIN
      clinicStaff: user?.clinicStaff, // populated if DOCTOR/STAFF
    },
    // Diagnosis
    diagnosis: {
      hasClinicId: !!session.clinicId,
      clinicIdInJwt: session.clinicId,
      clinicIdInDb: user?.clinic?.id ?? user?.clinicStaff?.clinicId ?? null,
      match:
        session.clinicId === (user?.clinic?.id ?? user?.clinicStaff?.clinicId),
    },
  });
}
