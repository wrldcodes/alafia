// app/api/clinics/[clinicId]/patients/route.ts
// Clinic staff views and searches patients who have appointments at their clinic.
// Patients view their own profile via /api/patients/me
//
// GET /api/clinics/:clinicId/patients?search=john&page=1&limit=20

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
    requireRole(session, [
      "SUPER_ADMIN",
      "CLINIC_ADMIN",
      "CLINIC_STAFF",
      "DOCTOR",
    ]);
    requireClinicAccess(session, params.clinicId);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Patients who have at least one appointment at this clinic
    const [patients, total] = await prisma.$transaction([
      prisma.patient.findMany({
        where: {
          appointments: { some: { clinicId: params.clinicId } },
          ...(search && {
            user: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search } },
              ],
            },
          }),
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          _count: { select: { appointments: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({
        where: { appointments: { some: { clinicId: params.clinicId } } },
      }),
    ]);

    return NextResponse.json({
      patients,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  },
);
