import { adminAuth } from '@/database/firebase-admin';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    if (decodedToken.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ message: "Valid token" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
