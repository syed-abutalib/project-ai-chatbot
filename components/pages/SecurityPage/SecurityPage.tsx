// app/safety/security/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Lock,
  Eye,
  Key,
  Database,
  Globe,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState("privacy");

  const securityFeatures = [
    {
      icon: Lock,
      title: "Encryption at Rest and in Transit",
      description:
        "All data is encrypted using AES-256 encryption at rest and TLS 1.3 for data in transit.",
    },
    {
      icon: Key,
      title: "Access Control",
      description:
        "Strict access controls with multi-factor authentication and principle of least privilege.",
    },
    {
      icon: Eye,
      title: "Privacy Protection",
      description:
        "We never sell user data. You maintain full ownership and control of your data.",
    },
    {
      icon: Database,
      title: "Data Isolation",
      description:
        "Customer data is logically isolated with strict separation between tenants.",
    },
    {
      icon: Shield,
      title: "Regular Audits",
      description:
        "Independent third-party security audits and penetration testing conducted regularly.",
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description:
        "GDPR, CCPA, SOC2, and ISO 27001 compliant. Data centers worldwide.",
    },
  ];

  const privacyPractices = [
    {
      title: "Data Collection",
      items: [
        "We collect only necessary data to provide and improve our services",
        "You have full visibility into what data we collect",
        "Clear opt-in/opt-out mechanisms for data collection",
      ],
    },
    {
      title: "Data Usage",
      items: [
        "Data is used solely for service delivery and improvement",
        "No third-party marketing or data selling",
        "Aggregated, anonymized data for research",
      ],
    },
    {
      title: "Data Storage",
      items: [
        "Data stored in secure, encrypted databases",
        "Multiple geographic regions available",
        "Automated backup and disaster recovery",
      ],
    },
    {
      title: "Your Rights",
      items: [
        "Right to access your data",
        "Right to delete your data",
        "Right to data portability",
        "Right to object to processing",
      ],
    },
  ];

  const certifications = [
    { name: "SOC 2 Type II", status: "Certified", year: "2024" },
    { name: "ISO 27001", status: "Certified", year: "2024" },
    { name: "GDPR", status: "Compliant", year: "2018" },
    { name: "CCPA", status: "Compliant", year: "2020" },
    { name: "HIPAA", status: "Eligible", year: "2024" },
    { name: "FedRAMP", status: "In Progress", year: "2024" },
  ];

  const timeline = [
    {
      date: "Q1 2024",
      event: "SOC 2 Type II Certification Renewed",
      description:
        "Successfully completed annual SOC 2 Type II audit with zero findings.",
    },
    {
      date: "Q4 2023",
      event: "ISO 27001:2022 Certification",
      description:
        "Achieved ISO 27001:2022 certification for information security management.",
    },
    {
      date: "Q3 2023",
      event: "Third-Party Penetration Test",
      description:
        "Completed comprehensive security assessment by leading security firm.",
    },
    {
      date: "Q2 2023",
      event: "Bug Bounty Program Launch",
      description:
        "Launched public bug bounty program with rewards up to $50,000.",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <main className="min-h-screen bg-black pt-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Badge
                variant="outline"
                className="mb-6 border-white/20 text-white/80"
              >
                Security & Privacy
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-medium text-white mb-6"
            >
              Your data is
              <br />
              <span className="text-white/60">safe with us</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              EduDev prioritizes security and privacy so you can focus on
              learning and building with confidence
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button
              variant={activeTab === "privacy" ? "default" : "ghost"}
              onClick={() => setActiveTab("privacy")}
              className={`rounded-full px-8 ${
                activeTab === "privacy"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white"
              }`}
            >
              User Privacy{" "}
            </Button>
            <Button
              variant={activeTab === "security" ? "default" : "ghost"}
              onClick={() => setActiveTab("security")}
              className={`rounded-full px-8 ${
                activeTab === "security"
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-black"
              }`}
            >
              Security Practices
            </Button>
          </div>

          {activeTab === "privacy" ? (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Privacy Overview */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge
                    variant="outline"
                    className="mb-4 border-white/20 text-white/80"
                  >
                    Privacy First
                  </Badge>
                  <h2 className="text-3xl font-medium text-white mb-4">
                    Your privacy is our priority
                  </h2>
                  <p className="text-white/60 mb-6">
                    We believe that privacy is a fundamental right. Our privacy
                    policy is designed to be transparent, easy to understand,
                    and respectful of your data.
                  </p>
                  <div className="space-y-4">
                    {[
                      "No data selling",
                      "Clear consent mechanisms",
                      "Data portability",
                      "Right to deletion",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-white/40" />
                        <span className="text-white/80">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-medium text-white mb-4">
                    Quick Links
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link
                        href="/safety/approach"
                        className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <span className="text-white/60">Safety & Approach</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Privacy Practices */}
              <div>
                <h2 className="text-2xl font-medium text-white mb-8">
                  Our Privacy Practices
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {privacyPractices.map((practice, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <h3 className="text-lg font-medium text-white mb-4">
                        {practice.title}
                      </h3>
                      <ul className="space-y-2">
                        {practice.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-white/60"
                          >
                            <CheckCircle className="w-4 h-4 text-white/40 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Security Features */}
              <div>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {securityFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10"
                    >
                      <feature.icon className="w-8 h-8 text-white mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-white/40">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="text-2xl font-medium text-white mb-8">
                  Certifications & Compliance
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 text-center"
                    >
                      <div className="text-sm font-medium text-white mb-1">
                        {cert.name}
                      </div>
                      <div className="text-xs text-white/40">
                        {cert.status} • {cert.year}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Security Timeline */}
              <div>
                <h2 className="text-2xl font-medium text-white mb-8">
                  Security Milestones
                </h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
                  {timeline.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12 pb-8 last:pb-0"
                    >
                      <div className="absolute left-0 w-8 h-8 bg-white/10 border-2 border-white/20 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-white/60" />
                      </div>
                      <div className="text-sm text-white/40 mb-1">
                        {item.date}
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        {item.event}
                      </h3>
                      <p className="text-sm text-white/40">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Report Vulnerability */}
      <section className="py-20 border-t border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <AlertCircle className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h2 className="text-3xl font-medium text-white mb-4">
              Found a security issue?
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              We take security seriously. If you've discovered a vulnerability,
              please report it through our responsible disclosure program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full">
                  Report vulnerability
                </Button>
              </Link>
              <Link href="/safety/approach">
                <Button
                  className="border-white/20 text-white hover:bg-white/50 px-8 py-6 rounded-full"
                >
                  View Safety Approach
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Security Team */}
      {/* <section className="py-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/40 text-sm">
            For security-related inquiries, contact our security team at{" "}
            <Link
              href="mailto:security@example.com"
              className="text-white hover:text-white/80 underline underline-offset-4"
            >
              security@example.com
            </Link>
          </p>
        </div>
      </section> */}
    </main>
  );
};

export default SecurityPage;
