// app/api/patients/me/route.ts
// Patient views and updates their own profile.
//
// GET /api/patients/me
// PUT /api/patients/me

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

export const GET = withErrorHandler(async (req: Request) => {
  const session = await requireAuth(req);
  requireRole(session, ["PATIENT"]);

  const patient = await prisma.patient.findUnique({
    where: { userId: session.userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      phone: true,
      createdAt: true,
      user: { select: { email: true } },
    },
  });

  if (!patient) {
    return NextResponse.json(
      { error: "Patient profile not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({ patient });
});

export const PUT = withErrorHandler(async (req: Request) => {
  const session = await requireAuth(req);
  requireRole(session, ["PATIENT"]);

  const body = await req.json();
  const { firstName, lastName, dateOfBirth, phone } = body;

  const patient = await prisma.patient.update({
    where: { userId: session.userId },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
      ...(phone !== undefined && { phone }),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      phone: true,
      user: { select: { email: true } },
    },
  });

  return NextResponse.json({ patient });
});
