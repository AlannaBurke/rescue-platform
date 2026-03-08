import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Rescue Platform",
    default: "Rescue Platform — Connecting Animals with Loving Homes",
  },
  description:
    "Find your perfect companion. Browse adoptable animals, learn about fostering, and support our mission to give every animal a second chance.",
  keywords: ["animal rescue", "adopt a pet", "foster animals", "dog adoption", "cat adoption"],
  openGraph: {
    type: "website",
    siteName: "Rescue Platform",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
