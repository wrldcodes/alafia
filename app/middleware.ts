import { NextRequest, NextResponse } from "next/server";
import { cookieName, verifyToken } from "@/lib/auth";

const CLINIC_ONLY = ["/dashboard/clinic", "/api/clinic"];
const PATIENT_ONLY = ["/dashboard/patient", "/api/patient"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(cookieName())?.value;
  const session = token ? await verifyToken(token) : null;

  if (
    !session &&
    !["/", "/login", "/register"].some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    session &&
    CLINIC_ONLY.some((p) => pathname.startsWith(p)) &&
    session.role !== "CLINIC"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    session &&
    PATIENT_ONLY.some((p) => pathname.startsWith(p)) &&
    session.role !== "PATIENT"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}
