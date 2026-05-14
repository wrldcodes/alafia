// app/api/clinics/[clinicId]/staff/[staffId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: Promise<{ clinicId: string; staffId: string }> };

// GET /api/clinics/:clinicId/staff/:staffId
export const GET = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, staffId } = await params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN", "CLINIC_STAFF"]);
    await requireClinicAccess(session, clinicId);

    const staff = await prisma.clinicStaff.findFirst({
      where: { id: staffId, clinicId },
      include: {
        user: { select: { id: true, email: true } },
        workingHours: { orderBy: { dayOfWeek: "asc" } },
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ staff });
  },
);

// PUT /api/clinics/:clinicId/staff/:staffId
export const PUT = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, staffId } = await params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN"]);
    await requireClinicAccess(session, clinicId);

    const body = await req.json();
    const { specialization, qualifications, bio, consultationFee, isActive } =
      body;

    const staff = await prisma.clinicStaff.update({
      where: { id: staffId },
      data: {
        ...(specialization !== undefined && { specialization }),
        ...(qualifications !== undefined && { qualifications }),
        ...(bio !== undefined && { bio }),
        ...(consultationFee !== undefined && { consultationFee }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    return NextResponse.json({ staff });
  },
);

// DELETE /api/clinics/:clinicId/staff/:staffId — soft delete
export const DELETE = withErrorHandler(
  async (req: NextRequest, { params }: Params) => {
    const { clinicId, staffId } = await params;
    const session = await requireAuth(req);
    requireRole(session, ["SUPER_ADMIN", "CLINIC_ADMIN"]);
    await requireClinicAccess(session, clinicId);

    await prisma.clinicStaff.update({
      where: { id: staffId },
      data: { isActive: false },
    });

    return NextResponse.json({ message: "Staff member deactivated" });
  },
);
