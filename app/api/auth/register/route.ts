import { NextRequest, NextResponse } from "next/server";
import { patientRegisterSchema, clinicRegisterSchema } from "@/lib/validations";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { cookieName, signToken } from "@/lib/auth";
import { createClinicUser, createPatientUser } from "@/lib/server/auth-helpers";
import { z } from "zod";

const registerPayloadSchema = z.discriminatedUnion("role", [
  patientRegisterSchema.extend({ role: z.literal("PATIENT") }),
  clinicRegisterSchema.extend({ role: z.literal("CLINIC") }),
]);

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = registerPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const { email, password } = payload;
  const normalizedEmail = email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    if (payload.role === "PATIENT") {
      const user = await createPatientUser(normalizedEmail, passwordHash, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        dateOfBirth: payload.dateOfBirth,
        phone: payload.phone,
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const res = NextResponse.json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.patient,
          },
        },
        token,
        status: 201,
      });
      res.cookies.set(cookieName(), token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return res;
    }

    const user = await createClinicUser(normalizedEmail, passwordHash, {
      clinicName: payload.clinicName,
      address: payload.address,
      phone: payload.phone,
      licenseNumber: payload.licenseNumber,
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.clinic,
        },
      },
      token,
      status: 201,
    });
    res.cookies.set(cookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
