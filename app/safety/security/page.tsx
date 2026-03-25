import Layout from "@/components/common/Layout";
import SecurityPage from "@/components/pages/SecurityPage/SecurityPage";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "AI Security & Privacy | EduDev",
  description:
    "Explore EduDev's AI security practices, data privacy policies, and compliance standards to ensure your data is safe.",
};
export default function page() {
  return (
    <Layout>
      <SecurityPage />
    </Layout>
  );
}
