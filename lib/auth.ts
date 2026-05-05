import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server"; 
const COOKIE_NAME = "accessToken";

export type SessionUser = {
  userId: string;
  email: string;
  role: "PATIENT" | "CLINIC";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export function requireRole(
  session: { role: string } | null,
  role: "PATIENT" | "CLINIC",
) {
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== role)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null; // null means passed
}


export async function signToken(payload: SessionUser) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") return null;

    const payload = decoded as JwtPayload & {
      userId?: string;
      email?: string;
      role?: "PATIENT" | "CLINIC";
    };
    if (!payload.userId || !payload.email || !payload.role) return null;

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

// Call this in Server Components or API Routes to get current user
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export function cookieName() {
  return COOKIE_NAME;
}

 
