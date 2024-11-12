import { NextResponse } from "next/server";
import { auth } from "@/firebase/firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import admin from "@/firebase/firebase-admin.config";

export async function POST(req: Request, res: Response) {
  const { email, password } = await req.json();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredential?.user) {
      const idToken = await userCredential.user.getIdToken();

      // log

      const decodeToken = await admin.auth().verifyIdToken(idToken);
      const cookieStore = await cookies();

      cookieStore.set("authToken", idToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 5,
      });

      return NextResponse.json(
        { message: "Login successfully", userCredential },
        { status: 200 }
      );
    }

    throw new Error("Something Wrong");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
