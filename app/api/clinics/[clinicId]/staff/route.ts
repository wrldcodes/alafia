// app/api/clinics/[clinicId]/staff/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/validators/auth";
import bcrypt from "bcryptjs";

type Params = { params: { clinicId: string } };

// GET /api/clinics/:clinicId/staff
// GET /api/clinics/:clinicId/staff?role=DOCTOR
export const GET = withErrorHandler(async (req: Request, ctx: Params) => {
  const params = ctx.params instanceof Promise ? await ctx.params : ctx.params;
  const session = await requireAuth(req);
  requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
  await requireClinicAccess(session, params.clinicId);

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");

  const staff = await prisma.clinicStaff.findMany({
    where: {
      clinicId: params.clinicId,
      isActive: true,
      ...(role && { role: role as Role }),
    },
    include: {
      user: { select: { id: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ staff });
});

// POST /api/clinics/:clinicId/staff
// Creates a new User + ClinicStaff record in one transaction.
// Body: { email, password, role, specialization?, qualifications?, bio?, consultationFee? }
export const POST = withErrorHandler(async (req: Request, ctx: Params) => {
  const params = ctx.params instanceof Promise ? await ctx.params : ctx.params;
  const session = await requireAuth(req);
  requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN"]);
  await requireClinicAccess(session, params.clinicId);

  const body = await req.json();
  const {
    email,
    password,
    role,
    specialization,
    qualifications,
    bio,
    consultationFee,
  } = body;

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "email, password, and role are required" },
      { status: 400 },
    );
  }

  const allowedRoles = ["CLINIC_ADMIN", "CLINIC_STAFF", "DOCTOR"];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json(
      { error: `role must be one of: ${allowedRoles.join(", ")}` },
      { status: 400 },
    );
  }

  if (role === "DOCTOR" && !specialization) {
    return NextResponse.json(
      { error: "specialization is required for DOCTOR role" },
      { status: 400 },
    );
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const staff = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email, passwordHash, role },
    });

    return tx.clinicStaff.create({
      data: {
        userId: user.id,
        clinicId: params.clinicId,
        role,
        ...(role === "DOCTOR" && {
          specialization,
          qualifications,
          bio,
          consultationFee,
        }),
      },
      include: {
        user: { select: { id: true, email: true } },
      },
    });
  });

  return NextResponse.json({ staff }, { status: 201 });
});
