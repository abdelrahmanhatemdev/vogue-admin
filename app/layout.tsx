import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { GeistSans } from "geist/font/sans";

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
    <html lang="en">
      <body
        className={`${GeistSans.className} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
