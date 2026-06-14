// app/api/admin/cleanup/users/route.ts
// Admin-only endpoint for deleting test users during development.
// Requires SUPER_ADMIN role.
//
// DELETE /api/admin/cleanup/users?id=USER_ID
// DELETE /api/admin/cleanup/users?email=user@example.com
// DELETE /api/admin/cleanup/users?confirmation=DELETE_ALL_USERS

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  requireRole,
  withErrorHandler,
} from "@/lib/validators/auth";

export const DELETE = withErrorHandler(async (req: Request) => {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await requireAuth(req);
  requireRole(session, ["SUPER_ADMIN"]);

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const email = url.searchParams.get("email");
  const confirmation = url.searchParams.get("confirmation");

  const user =
    typeof id === "string" && id
      ? await prisma.user.findUnique({ where: { id } })
      : typeof email === "string" && email
        ? await prisma.user.findUnique({ where: { email } })
        : null;

  // Delete specific user by id or email
  if (user) {
    await prisma.$transaction(async (tx) => {
      // Delete patient data if exists
      if (user.role === "PATIENT") {
        const patient = await tx.patient.findUnique({
          where: { userId: user.id },
        });

        if (patient) {
          await tx.appointment.deleteMany({
            where: { patientId: patient.id },
          });

          await tx.patient.delete({ where: { id: patient.id } });
        }
      }

      // Delete clinic staff if exists
      if (["DOCTOR", "CLINIC_STAFF", "CLINIC_ADMIN"].includes(user.role)) {
        const staff = await tx.clinicStaff.findUnique({
          where: { userId: user.id },
        });

        if (staff) {
          await tx.workingHours.deleteMany({
            where: { staffId: staff.id },
          });

          await tx.appointment.deleteMany({
            where: { doctorId: staff.id },
          });

          await tx.timeSlot.deleteMany({
            where: { staffId: staff.id },
          });

          await tx.clinicStaff.delete({ where: { id: staff.id } });
        }
      }

      // Delete clinic if this was a clinic admin
      if (user.role === "CLINIC_ADMIN") {
        const clinic = await tx.clinic.findUnique({
          where: { userId: user.id },
        });

        if (clinic) {
          await tx.clinic.delete({ where: { id: clinic.id } });
        }
      }

      await tx.user.delete({ where: { id: user.id } });
    });

    return NextResponse.json({
      message: `User ${user.email} and related data deleted successfully`,
    });
  }

  // Delete all users (requires explicit confirmation)
  if (confirmation === "DELETE_ALL_USERS") {
    const deleted = await prisma.$transaction(async (tx) => {
      // Delete all appointments
      await tx.appointment.deleteMany({});

      // Delete all time slots
      await tx.timeSlot.deleteMany({});

      // Delete all working hours
      await tx.workingHours.deleteMany({});

      // Delete all clinic staff
      await tx.clinicStaff.deleteMany({});

      // Delete all patients
      await tx.patient.deleteMany({});

      // Delete all clinics
      await tx.clinic.deleteMany({});

      // Delete all users except super admin
      const result = await tx.user.deleteMany({
        where: {
          role: {
            not: "SUPER_ADMIN",
          },
        },
      });

      return result.count;
    });

    return NextResponse.json({
      message: `Deleted ${deleted} users and all related data`,
    });
  }

  return NextResponse.json(
    {
      error:
        "Provide query param: ?id=USER_ID or ?email=user@example.com or ?confirmation=DELETE_ALL_USERS",
    },
    { status: 400 },
  );
});
