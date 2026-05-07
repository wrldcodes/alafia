// app/api/clinics/[clinicId]/patients/route.ts
// Clinic staff views patients who have appointments at their clinic.
//
// GET /api/clinics/:clinicId/patients
// GET /api/clinics/:clinicId/patients?search=john&page=1&limit=20

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  requireClinicAccess,
  withErrorHandler,
} from "@/lib/auth";

type Params = { params: { clinicId: string } };

export const GET = withErrorHandler(
  async (req: Request, { params }: Params) => {
    const session = await requireAuth();
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

    // Search matches against firstName, lastName, email, or phone
    const searchFilter = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" as const } },
            { lastName: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search } },
            {
              user: {
                email: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {};

    const baseWhere = {
      appointments: { some: { clinicId: params.clinicId } },
      ...searchFilter,
    };

    const [patients, total] = await prisma.$transaction([
      prisma.patient.findMany({
        where: baseWhere,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          dateOfBirth: true,
          createdAt: true,
          user: { select: { email: true } },
          _count: { select: { appointments: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where: baseWhere }),
    ]);

    return NextResponse.json({
      patients,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  },
);
