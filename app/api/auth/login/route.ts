import { NextResponse } from "next/server";
import { adminAuth } from "@/database/firebase-admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const isAdmin = decodedToken.admin || false; 

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    (await cookies()).set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    (await cookies()).set("token", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ success: true, uid: decodedToken.uid, isAdmin });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
