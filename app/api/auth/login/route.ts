import bcrypt from "bcrypt";
import db from "@/lib/db";
import { AdminLoginSchema } from "@/lib/validation/adminAuth/adminLoginSchema";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RowDataPacket } from "mysql2";
import { signIn } from "next-auth/react";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    await AdminLoginSchema.parseAsync({ email, password });

    const [result] = await db.query<(Admin & RowDataPacket)[]>(
      "SELECT * FROM admins WHERE deletedAt IS NULL AND email = ? LIMIT 1",
      [email]
    );
    const user = result[0];

    if (!user) {
      throw new Error("No user found with this email");
    }

    const isValidPassword = await bcrypt.compare(password, `${user?.password}`);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      updatedAt: user.updatedAt,
      role: "admin",
    };
    //   // router.push("/admin");
    return NextResponse.json({ message: "Login In Proccess" }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: `${error.errors[0].message}` },
        { status: 500 }
      );
    }
    const message = error instanceof Error ? error.message : "Something Wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
