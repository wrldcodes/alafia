// app/api/patients/me/route.ts
// Patient views and updates their own profile.
// GET  /api/patients/me
// PUT  /api/patients/me

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireRole, withErrorHandler } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth(req);
  requireRole(session, ["PATIENT"]);

  const patient = await prisma.patient.findUnique({
    where: { userId: session.id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!patient)
    return NextResponse.json(
      { error: "Patient profile not found" },
      { status: 404 },
    );
  return NextResponse.json({ patient });
});

export const PUT = withErrorHandler(async (req: NextRequest) => {
  const session = await requireAuth(req);
  requireRole(session, ["PATIENT"]);

  const body = await req.json();
  // Add whatever fields are on your Patient model (dob, bloodGroup, allergies, etc.)
  const {
    dateOfBirth,
    bloodGroup,
    allergies,
    emergencyContactName,
    emergencyContactPhone,
  } = body;

  const patient = await prisma.patient.update({
    where: { userId: session.id },
    data: {
      ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
      ...(bloodGroup !== undefined && { bloodGroup }),
      ...(allergies !== undefined && { allergies }),
      ...(emergencyContactName !== undefined && { emergencyContactName }),
      ...(emergencyContactPhone !== undefined && { emergencyContactPhone }),
    },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return NextResponse.json({ patient });
});
