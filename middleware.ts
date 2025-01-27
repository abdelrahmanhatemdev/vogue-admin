import { NextResponse, type NextRequest } from "next/server";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: "Too many requests, please try again later.",
});

export async function middleware(req: NextRequest, res: NextResponse) {
  apiLimiter(req, res, () => {
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      { status: 500 }
    );
  });

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
