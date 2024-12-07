import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
   
   if (pathname === '/admin/login' ) {
     return NextResponse.next();
   }
 
   if (!token || token?.role !== 'admin') {
     return NextResponse.redirect(new URL('/admin/login', req.url));
   }
 
   return NextResponse.next();
}

export const config = {
  matcher: [
    // // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // // // Always run for API routes
    // "/(api|trpc)(.*)",
    "/admin/:path*",
  ],
};
