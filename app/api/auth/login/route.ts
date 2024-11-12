import { NextResponse } from "next/server";
import { auth } from "@/firebase/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    if (user?.user) {
      return NextResponse.json(
        { message: "Login successfully", user },
        { status: 200 }
      );
    }

    throw new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
