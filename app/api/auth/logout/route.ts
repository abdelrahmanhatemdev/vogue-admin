import { auth } from "@/firebase/firebase.config";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { email, password } = await req.json();

  try {
    await auth.signOut()

    return NextResponse.json(
      { message: "Sign out successfully" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
