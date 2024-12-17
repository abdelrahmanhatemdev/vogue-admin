import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextResponse, type NextRequest } from "next/server";
import { authOptions } from "./lib/auth";
import path from "path";
import fs from 'fs';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  //  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  //  console.log("token", token);
   
   
  //  if (pathname === '/admin/login' ) {
  //    return NextResponse.next();
  //  }
 
  //  if (!token || token?.role !== 'admin') {
  //    return NextResponse.redirect(new URL('/admin/login', req.url));
  //  }
  const url = new URL(req.url);

  // console.log("filePath", url);
  // if (url.pathname.startsWith('/uploads/')) {
  //   const filePath = path.join(process.cwd(), url.pathname);

    

  //   if (fs.existsSync(filePath)) {
  //     const file = fs.readFileSync(filePath);

  //     const contentType = path.extname(filePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

  //     return new Response(file, {
  //       headers: {
  //         'Content-Type': contentType,
  //       },
  //     });
  //   }

  //   return NextResponse.json({ error: 'File not found' }, { status: 404 });
  // }
 
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
