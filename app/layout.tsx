import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import LenisScroll from "@/components/common/lenis-scroll";
import { TooltipProvider } from "@/components/ui/tooltip";
import SupabaseProvider from "@/contexts/superbase-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduDev AI Platform | Transform Your Workflow",
  description:
    "Discover EduDev's AI platform that boosts productivity, improves decision-making, and scales your business efficiently.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: 'google-site-verification=QMXXenb-Ws7mQ7BKxpIcEuVJPok6YkD04odcY-Goai0',
  },
  openGraph: {
    title: "EduDev AI Platform | Transform Your Workflow",
    description:
      "Discover EduDev's AI platform that boosts productivity, improves decision-making, and scales your business efficiently.",
    images: {
      url: "/logo.png", // logo image
      width: 512,
      height: 512,
      alt: "EduDev Logo",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDev AI Platform | Transform Your Workflow",
    description:
      "Discover EduDev's AI platform that boosts productivity, improves decision-making, and scales your business efficiently.",
    images: "/logo.png",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LenisScroll>
          <ClerkProvider>
            <SupabaseProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </SupabaseProvider>
          </ClerkProvider>
        </LenisScroll>
      </body>
    </html>
  );
}
