import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: "Bookmarks — Organize your web",
  description:
    "A beautiful bookmark manager to save, organize, and rediscover your favorite links.",
  openGraph: {
    title: "Bookmarks — Organize your web",
    description:
      "A beautiful bookmark manager to save, organize, and rediscover your favorite links.",
    url: "/",
    siteName: "Bookmarks",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bookmarks app dashboard with organized collections of links.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bookmarks — Organize your web",
    description:
      "A beautiful bookmark manager to save, organize, and rediscover your favorite links.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
