import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./firebase/firebase.config";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  

  console.log("pathname", req.nextUrl.clone());
  console.log("headers", req.headers.get("Authorization"));

  // if (pathname.startsWith("/admin")) {
  //   // const user = auth.currentUser
  //   // console.log("auth.currentUser", auth.currentUser);
  //   // if (user) {
  //   //   return NextResponse.next();
  //   // }
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    // // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // // // Always run for API routes
    // "/(api|trpc)(.*)",
    "/admin/:path*",
  ],
};
