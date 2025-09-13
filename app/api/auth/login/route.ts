import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { adminAuth } from "@/database/firebase-admin";

export async function POST(req: Request) {
  const { idToken } = await req.json();

  // Firebase requires maxAge <= 2 weeks
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

  const cookie = serialize("session", sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/", // ✅ important
    maxAge: expiresIn / 1000,
    sameSite: "lax",
  });

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Set-Cookie": cookie },
  });
}
