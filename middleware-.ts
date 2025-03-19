import { NextResponse, type NextRequest } from "next/server";
import {jwtDecode} from "jwt-decode"
import { adminAuth } from "./database/firebase-admin";

export const config = {
  matcher: ["/:path*"],
  runtime: "nodejs",
};

export async function middleware(req: NextRequest, res: NextResponse) {

  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

 
  // const user = jwtDecode(token)

  // if (user?.role !== "admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  





  return NextResponse.next();
}


