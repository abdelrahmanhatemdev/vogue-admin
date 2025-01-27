import { RateLimiterMemory } from "rate-limiter-flexible";

import { NextResponse, type NextRequest } from "next/server";

const rateLimiter = new RateLimiterMemory({
  points: 10, 
  duration: 1,
});

export async function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.headers.get("host") ||
    "unknown-ip";

  try {
    await rateLimiter.consume(ip);
    return NextResponse.next();
  } catch (err) {
    return new Response("Too many requests, please try again later.", {
      status: 429,
    });
  }
}

export const config = {
  matcher: ["/:path*"],
};
