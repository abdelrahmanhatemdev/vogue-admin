import type { Metadata } from "next";
import "@/app/globals.css";

import { GeistSans } from "geist/font/sans";
import dynamic from "next/dynamic";
import Providers from "@/providers";

const Toaster = dynamic(() =>
  import("react-hot-toast").then((module) => module.Toaster)
);

export const metadata: Metadata = {
  title: "Vogue Admin | E-commerce Dashboard",
  description: "Vogue Admin is a modern, full-featured admin dashboard for managing e-commerce products, categories, orders, and store settings with ease.",
  icons: {
    icon: "/icons/favicon-32.png",
    shortcut: "/icons/favicon-16.png",
    apple: "/icons/favicon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={`${GeistSans.className} antialiased bg-background text-foreground`}>
          <div className="flex items-center justify-center min-h-screen">
            {children}
          </div>
          <Toaster />
        </body>
      </html>
    </Providers>
  );
}
