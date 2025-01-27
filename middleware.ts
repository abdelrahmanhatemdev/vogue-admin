import { NextResponse, type NextRequest } from "next/server";
import rateLimit from "express-rate-limit";



export async function middleware(req: NextRequest, res: NextResponse) {

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
