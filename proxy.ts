// proxy.ts — Next.js 16+ proxy (replaces middleware.ts)
// Edge-compatible: uses jose (Web Crypto API) for JWT verification.
// jsonwebtoken / Prisma are Node.js only — NOT imported here.

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "accessToken";

// Routes that are always public (no auth needed)
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/support",
  "/terms",
  "/privacy",
  "/forgot-password",
  "/unauthorized",
];

// Legacy MVP routes (mock dashboards — still public during migration)
const LEGACY_PUBLIC_PATHS = ["/enroll", "/signup", "/home", "/dashboard"];

// Role-restricted dashboard paths (matches app/(dashboard)/* URLs)
const CLINIC_ROLES = ["CLINIC_ADMIN", "CLINIC_STAFF", "SUPER_ADMIN"];
const CLINIC_PATHS = ["/clinic"];
const PATIENT_PATHS = ["/patient"];
const DOCTOR_PATHS = ["/doctor"];

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

interface SessionUser {
  userId: string;
  email: string;
  role: string;
  clinicId?: string;
  staffId?: string;
}

async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (!payload.userId || !payload.email || !payload.role) return null;
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      clinicId: payload.clinicId as string | undefined,
      staffId: payload.staffId as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow static assets and auth API routes without any checks
  const isStaticOrApi =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|woff|woff2|ttf|otf)$/.test(pathname);

  if (isStaticOrApi) return NextResponse.next();

  const isPublic =
    PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    ) ||
    LEGACY_PUBLIC_PATHS.some(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  // Already logged in and visiting login/register → redirect to their dashboard
  if (
    session &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname.startsWith("/register/"))
  ) {
    const dashboardMap: Record<string, string> = {
      SUPER_ADMIN: "/clinic",
      CLINIC_ADMIN: "/clinic",
      CLINIC_STAFF: "/clinic",
      DOCTOR: "/doctor",
      PATIENT: "/patient",
    };
    return NextResponse.redirect(
      new URL(dashboardMap[session.role] ?? "/clinic", req.url),
    );
  }

  // Not authenticated + not a public path → redirect to login
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access control
  if (session) {
    const isClinicPath = CLINIC_PATHS.some((p) => pathname.startsWith(p));
    const isPatientPath = PATIENT_PATHS.some((p) => pathname.startsWith(p));
    const isDoctorPath = DOCTOR_PATHS.some((p) => pathname.startsWith(p));

    if (isClinicPath && !CLINIC_ROLES.includes(session.role)) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (isPatientPath && session.role !== "PATIENT") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (
      isDoctorPath &&
      session.role !== "DOCTOR" &&
      !CLINIC_ROLES.includes(session.role)
    ) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - Public static file extensions
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
