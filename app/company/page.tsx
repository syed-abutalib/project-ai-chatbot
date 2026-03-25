import Layout from "@/components/common/Layout";
import CompanyPage from "@/components/pages/About/CompanyPage";
import { Metadata } from "next";
import React from "react";
export const metadata = {
  title: "About EduDev | Company Information",
  description:
    "Learn more about EduDev, our mission, team, and values driving innovation in AI and education.",
  keywords: [
    "EduDev",
    "company",
    "about us",
    "team",
    "mission",
    "AI education",
  ],
  openGraph: {
    title: "About EduDev | Company Information",
    description:
      "Learn more about EduDev, our mission, team, and values driving innovation in AI and education.",
    url: "/company",
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
    title: "About EduDev | Company Information",
    description:
      "Discover EduDev's mission, team, and values driving innovation in AI and education.",
    images: ["/logo.png"], // logo
  },
};

export default function page() {
  return (
    <Layout>
      <CompanyPage />
    </Layout>
  );
}
