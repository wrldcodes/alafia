// app/api/auth/login/route.ts
// Works for all roles: PATIENT, CLINIC_ADMIN, CLINIC_STAFF, DOCTOR, SUPER_ADMIN
// JWT now carries clinicId + staffId so downstream routes don't need extra lookups

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, buildSessionPayload, cookieName } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Build full session payload (includes clinicId, staffId where relevant)
    const payload = await buildSessionPayload(user.id);
    const token = await signToken(payload);

    // Redirect path per role
    const dashboardMap: Record<string, string> = {
      SUPER_ADMIN: "/dashboard/admin",
      CLINIC_ADMIN: "/dashboard/clinic",
      CLINIC_STAFF: "/dashboard/staff",
      DOCTOR: "/dashboard/doctor",
      PATIENT: "/dashboard/patient",
    };

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
      redirectTo: dashboardMap[user.role] ?? "/dashboard",
    });

    response.cookies.set(cookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[Login Error]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
