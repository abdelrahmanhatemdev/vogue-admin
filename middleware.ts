import { NextResponse, type NextRequest } from "next/server";
import { adminAuth } from "./database/firebase-admin";

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|forgot-password).*)",
  ],
  runtime: "nodejs",
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const sessionCookie = req.cookies.get("session")?.value;

  console.log("pathname:", url.pathname, "sessionCookie:", sessionCookie);

  if (!sessionCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    if (!decodedClaims.admin) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
