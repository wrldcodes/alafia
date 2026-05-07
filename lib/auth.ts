import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "accessToken";

// ─── Types ────────────────────────────────────────────────────────────────

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
  // Populated for all clinic roles (CLINIC_ADMIN, CLINIC_STAFF, DOCTOR)
  // so routes can scope queries without an extra DB lookup
  clinicId?: string;
  // For DOCTOR role: their ClinicStaff.id (used to filter their appointments)
  staffId?: string;
};

// ─── JWT helpers ──────────────────────────────────────────────────────────

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

// ─── Session ──────────────────────────────────────────────────────────────

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export function cookieName() {
  return COOKIE_NAME;
}

// ─── Guards ───────────────────────────────────────────────────────────────
// All guards THROW a NextResponse on failure.
// Wrap your route handler with withErrorHandler() to catch them cleanly.

// Reads session from cookie. Throws 401 if not authenticated.
export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

// Throws 403 if session role is not in the allowed list.
export function requireRole(session: SessionUser, roles: Role[]) {
  if (!roles.includes(session.role)) {
    throw NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
}

// Ensures the session user belongs to the target clinic.
// SUPER_ADMIN bypasses this check.
export function requireClinicAccess(session: SessionUser, clinicId: string) {
  if (session.role === "SUPER_ADMIN") return;
  if (session.clinicId !== clinicId) {
    throw NextResponse.json(
      { error: "Access denied to this clinic" },
      { status: 403 },
    );
  }
}

// ─── Error handler wrapper ────────────────────────────────────────────────
// Catches thrown NextResponse errors from guards and unexpected errors.
// Usage:
//   export const GET = withErrorHandler(async (req, ctx) => { ... })

type RouteHandler = (req: Request, ctx?: any) => Promise<NextResponse>;

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

// ─── Login helper ─────────────────────────────────────────────────────────
// Call this in your login route after verifying the password.
// Fetches clinicId and staffId automatically so the JWT carries them.

export async function buildSessionPayload(
  userId: string,
): Promise<SessionUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      clinicStaff: { select: { id: true, clinicId: true } },
      clinic: { select: { id: true } },
    },
  });

  if (!user) throw new Error("User not found");

  const base = { userId: user.id, email: user.email, role: user.role as Role };

  // CLINIC_ADMIN who owns the clinic — clinicId comes from Clinic record
  if (user.role === "CLINIC_ADMIN" && user.clinic) {
    return { ...base, clinicId: user.clinic.id };
  }

  // Staff or Doctor — clinicId and staffId come from ClinicStaff record
  if (user.clinicStaff) {
    return {
      ...base,
      clinicId: user.clinicStaff.clinicId,
      staffId: user.clinicStaff.id,
    };
  }

  // PATIENT or SUPER_ADMIN — no clinic context needed
  return base;
}
