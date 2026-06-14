import { NextRequest, NextResponse } from "next/server";
import {
  patientRegisterSchema,
  clinicRegisterSchema,
} from "@/lib/validators/validations";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { cookieName, signToken } from "@/lib/validators/auth";
import { createClinicUser, createPatientUser } from "@/lib/server/auth-helpers";
import { z } from "zod";

const registerPayloadSchema = z.discriminatedUnion("role", [
  patientRegisterSchema.extend({ role: z.literal("PATIENT") }),
  clinicRegisterSchema.extend({ role: z.literal("CLINIC_ADMIN") }),
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
  try {
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    if (payload.role === "CLINIC_ADMIN" && payload.licenseNumber) {
      const existingClinic = await prisma.clinic.findFirst({
        where: { licenseNumber: payload.licenseNumber },
        select: { id: true },
      });

      if (existingClinic) {
        return NextResponse.json(
          { error: "Clinic already exists" },
          { status: 409 },
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

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

      const patientBody: Record<string, unknown> = {
        data: {
          id: user.id,
          profileId: user.patient?.id ?? null,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: user.patient,
          },
        },
      };
      if (process.env.NODE_ENV !== "production") {
        patientBody.token = token;
      }

      const res = NextResponse.json(patientBody, { status: 201 });
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
      clinicId: user.clinic?.id,
    });

    const clinicBody: Record<string, unknown> = {
      data: {
        id: user.id,
        clinicId: user.clinic?.id ?? null,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.clinic,
        },
      },
    };
    if (process.env.NODE_ENV !== "production") {
      clinicBody.token = token;
    }

    const res = NextResponse.json(clinicBody, { status: 201 });
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

    const code =
      typeof err === "object" && err !== null && "code" in err
        ? String((err as { code?: string }).code)
        : null;

    if (code === "P1001") {
      return NextResponse.json(
        { error: "Database is unreachable" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
