import Layout from "@/components/common/Layout";
import SafetyApproachPage from "@/components/pages/SafetyApproachPage/SafetyApproachPage";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "EduDev AI Safety Approach",
  description:
    "Discover EduDev's comprehensive approach to AI safety, ethical alignment, and responsible AI deployment.",
  keywords: [
    "EduDev",
    "AI safety",
    "responsible AI",
    "ethical AI",
    "safety framework",
  ],
  openGraph: {
    title: "EduDev AI Safety Approach",
    description:
      "Explore our multi-layered framework to ensure AI systems are safe, reliable, and aligned with human values.",
    url: "/safety/approach",
    siteName: "EduDev",
    images: [
      {
        url: "/logo.png", // <-- your logo here
        width: 512,
        height: 512,
        alt: "EduDev Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDev AI Safety Approach",
    description:
      "Learn about EduDev's multi-layered safety framework for responsible AI deployment.",
    images: ["/logo.png"],
  },
};
export default function page() {
  return (
    <Layout>
      <SafetyApproachPage />
    </Layout>
  );
}
