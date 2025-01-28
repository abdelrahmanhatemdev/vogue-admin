import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest, res: NextResponse) {

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
