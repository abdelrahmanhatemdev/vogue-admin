import type { Metadata } from "next";
import "./globals.css";

import { GeistSans } from "geist/font/sans";
import dynamic from "next/dynamic";
import Providers from "@/providers";

const Toaster = dynamic(() =>
  import("react-hot-toast").then((module) => module.Toaster)
);

export const metadata: Metadata = {
  title: "Vogue Admin",
  description: "Generated by Vogue Admin app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers >
      <html lang="en">
        <body className={`${GeistSans.className} antialiased`}>
          {children}
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
