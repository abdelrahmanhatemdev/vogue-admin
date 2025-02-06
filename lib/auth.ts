import { adminAuth } from "@/database/firebase-admin";
import { cookies } from "next/headers";


export async function getUser() {
  const token = (await cookies()).get("session")?.value;

  let user = null;

  if (token) {
    try {
      user = await adminAuth.verifySessionCookie(token, true);
    } catch (error) {
      console.error("Error verifying session cookie:", error);
    }
  }
  return user;
}
