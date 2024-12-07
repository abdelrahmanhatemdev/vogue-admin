import { NextResponse } from "next/server";
import { signOut } from "next-auth/react";

export async function GET() {
  try {
    await signOut();

    return NextResponse.json(
      { message: "Sign out successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
