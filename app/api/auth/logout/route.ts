
import { NextResponse } from "next/server";
import { cookieName } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  response.cookies.set(cookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // immediately expires the cookie
    path: "/",
  });

  return response;
}
