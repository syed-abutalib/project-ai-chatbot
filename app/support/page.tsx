import Layout from "@/components/common/Layout";
import SupportPage from "@/components/pages/SupportPage/SupportPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "EduDev Support | Help & Assistance",
  description:
    "Get help from EduDev's support team. Access guides, FAQs, and resources for AI tools and platform assistance.",
  keywords: [
    "EduDev support",
    "help",
    "FAQ",
    "AI platform assistance",
    "customer service",
  ],
  openGraph: {
    title: "EduDev Support | Help & Assistance",
    description:
      "Contact EduDev support or explore guides and resources to maximize your AI platform experience.",
    url: "/support",
    siteName: "EduDev",
    images: [
      {
        url: "/logo.png", // <-- your logo
        width: 512,
        height: 512,
        alt: "EduDev Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDev Support | Help & Assistance",
    description:
      "Find answers, guides, and resources to get the most out of EduDev's AI tools.",
    images: ["/logo.png"],
  },
};
export default function Page() {
  return (
    <Layout>
      <SupportPage />
    </Layout>
  );
}
