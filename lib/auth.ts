import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "accessToken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}

export async function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, getJwtSecret());
    if (typeof decoded === "string") return null;

    const payload = decoded as JwtPayload & { userId?: string; email?: string };
    if (!payload.userId || !payload.email) return null;

    return { userId: payload.userId, email: payload.email };
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
