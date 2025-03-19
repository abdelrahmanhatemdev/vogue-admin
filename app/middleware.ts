import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Call API route to verify token
  const verifyRes = await fetch(`${req.nextUrl.origin}/api/auth/verify`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("verifyRes", verifyRes);
  

  if (!verifyRes.ok) {
    return NextResponse.redirect(new URL("/login", req.url));;
  }

  return NextResponse.next();
}

// Keep default Edge runtime (no need for `nodeMiddleware`)
export const config = {
  matcher: ["/:path*"],
};
