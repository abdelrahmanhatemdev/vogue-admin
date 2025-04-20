import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    path: "/",
    expires: new Date(0),
  };

  (await cookies()).set("session", "", options);
  (await cookies()).set("token", "", options);

  return NextResponse.json({ success: true });
}
