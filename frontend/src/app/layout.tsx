import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Radar | AI-Powered Startup Job Discovery",
  description: "Stop guessing. We use AI to find early-stage startups with high hiring probability and remote-first DNA. Discover your next unicorn role before the crowd.",
  keywords: ["startup jobs", "remote developer jobs", "software engineering jobs", "tech startups"],
  metadataBase: new URL('https://jobradar.dev'),
  openGraph: {
    title: "Job Radar - Discover Early-Stage Startup Jobs",
    description: "AI-powered job discovery tool for developers to find high-growth remote startup jobs.",
    url: "/",
    siteName: "Job Radar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Radar | Remote Startup Jobs",
    description: "Discover early-stage startup jobs with high hiring probability.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 flex flex-col pt-16">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
