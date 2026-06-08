// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  signToken,
  buildSessionPayload,
  cookieName,
} from "@/lib/validators/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const payload = await buildSessionPayload(user.id);
    const token = await signToken(payload);

    const dashboardMap: Record<string, string> = {
      SUPER_ADMIN: "/clinic",
      CLINIC_ADMIN: "/clinic",
      CLINIC_STAFF: "/clinic",
      DOCTOR: "/doctor",
      PATIENT: "/patient",
    };

    const response = NextResponse.json({
      message: "Login successful",
      token, // ← raw JWT for Bearer auth / Postman
      user: {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        clinicId: payload.clinicId ?? null,
        staffId: payload.staffId ?? null,
      },
      redirectTo: dashboardMap[user.role] ?? "/dashboard",
    });

    // Also set httpOnly cookie for browser use
    response.cookies.set(cookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
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
