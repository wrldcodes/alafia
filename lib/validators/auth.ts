// lib/auth.ts

import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "accessToken";

export type Role =
  | "SUPER_ADMIN"
  | "CLINIC_ADMIN"
  | "CLINIC_STAFF"
  | "DOCTOR"
  | "PATIENT";

export type SessionUser = {
  userId: string;
  email: string;
  role: Role;
  clinicId?: string;
  staffId?: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

export async function signToken(payload: SessionUser) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") return null;
    const payload = decoded as JwtPayload & Partial<SessionUser>;
    if (!payload.userId || !payload.email || !payload.role) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      clinicId: payload.clinicId,
      staffId: payload.staffId,
    };
  } catch {
    return null;
  }
}

// Checks Bearer header first, then cookie.
export async function getSession(
  req?: Request | NextRequest,
): Promise<SessionUser | null> {
  if (req) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const bearerToken = authHeader.slice(7).trim();
      if (bearerToken) {
        const session = await verifyToken(bearerToken);
        if (session) return session;
      }
    }

    if ("cookies" in req) {
      const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
      if (cookieToken) return await verifyToken(cookieToken);
    }
  }

  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE_NAME)?.value;
  if (cookieToken) return await verifyToken(cookieToken);

  return null;
}

export function cookieName() {
  return COOKIE_NAME;
}

export async function buildSessionPayload(
  userId: string,
): Promise<SessionUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clinic: { select: { id: true } },
      clinicStaff: { select: { id: true, clinicId: true } },
    },
  });

  if (!user) throw new Error("User not found");

  const base: SessionUser = {
    userId: user.id,
    email: user.email,
    role: user.role as Role,
  };

  if (user.role === "CLINIC_ADMIN" && user.clinic) {
    return { ...base, clinicId: user.clinic.id };
  }

  if (
    (user.role === "CLINIC_STAFF" || user.role === "DOCTOR") &&
    user.clinicStaff
  ) {
    return {
      ...base,
      clinicId: user.clinicStaff.clinicId,
      staffId: user.clinicStaff.id,
    };
  }

  return base;
}

export async function requireAuth(
  req?: Request | NextRequest,
): Promise<SessionUser> {
  const session = await getSession(req);
  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export function requireRole(session: SessionUser, roles: Role[]) {
  if (!roles.includes(session.role)) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

async function getCurrentClinicId(session: SessionUser) {
  switch (session.role) {
    case "SUPER_ADMIN":
      return null;
    case "CLINIC_ADMIN": {
      const clinic = await prisma.clinic.findUnique({
        where: { userId: session.userId },
        select: { id: true },
      });

      return clinic?.id ?? session.clinicId ?? null;
    }
    case "CLINIC_STAFF":
    case "DOCTOR": {
      const staff = await prisma.clinicStaff.findUnique({
        where: { userId: session.userId },
        select: { clinicId: true },
      });

      return staff?.clinicId ?? session.clinicId ?? null;
    }
    default:
      return session.clinicId ?? null;
  }
}

export async function requireClinicAccess(
  session: SessionUser,
  clinicId: string,
) {
  if (session.role === "SUPER_ADMIN") return;

  const currentClinicId = await getCurrentClinicId(session);

  if (!currentClinicId) {
    throw NextResponse.json(
      {
        error: "No clinic associated with this account. Please log in again.",
        code: "NO_CLINIC_IN_TOKEN",
      },
      { status: 403 },
    );
  }

  if (currentClinicId !== clinicId) {
    throw NextResponse.json(
      {
        error: "Access denied to this clinic",
        code: "CLINIC_MISMATCH",
        debug:
          process.env.NODE_ENV === "development"
            ? {
                tokenClinicId: session.clinicId,
                currentClinicId,
                requestedClinicId: clinicId,
                hint: "Re-login to refresh your token, or check the clinicId in your URL.",
              }
            : undefined,
      },
      { status: 403 },
    );
  }
}

type RouteHandler = (req: NextRequest, ctx?: any) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (err) {
      if (err instanceof NextResponse) return err;
      console.error("[Route Error]", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
