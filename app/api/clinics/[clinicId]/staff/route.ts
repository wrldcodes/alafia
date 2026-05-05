
// Clinic admin manages all staff (including doctors) from here.
//
// GET  /api/clinics/:clinicId/staff            — list all staff
// POST /api/clinics/:clinicId/staff            — add a user as staff/doctor

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: { clinicId: string } };

export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
    requireClinicAccess(session, params.clinicId);

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role"); // optional: ?role=DOCTOR

    const staff = await prisma.clinicStaff.findMany({
      where: {
        clinicId: params.clinicId,
        isActive: true,
        ...(role && { role: role as any }),
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ staff });
  },
);

export const POST = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN"]);
    requireClinicAccess(session, params.clinicId);

    const body = await req.json();
    const {
      userId,
      role,
      specialization,
      qualifications,
      bio,
      consultationFee,
    } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
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
        { error: "specialization is required for doctors" },
        { status: 400 },
      );
    }

    // Check user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Prevent duplicate staff entry
    const existing = await prisma.clinicStaff.findUnique({ where: { userId } });
    if (existing) {
      return NextResponse.json(
        { error: "This user is already assigned to a clinic" },
        { status: 409 },
      );
    }

    const staff = await prisma.clinicStaff.create({
      data: {
        userId,
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
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Update the User's role field to match
    await prisma.user.update({ where: { id: userId }, data: { role } });

    return NextResponse.json({ staff }, { status: 201 });
  },
);
