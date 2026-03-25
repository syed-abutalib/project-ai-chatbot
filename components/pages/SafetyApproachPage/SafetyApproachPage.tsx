// app/safety/approach/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Eye,
  Lock,
  Scale,
  Users,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Download,
} from "lucide-react";
import Link from "next/link";

const SafetyApproachPage = () => {
  const principles = [
    {
      icon: Shield,
      title: "Proactive Safety",
      description:
        "We design EduDev models to prevent harmful outputs and ensure a safe learning environment.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "We share how our models work and publish insights to help our users understand AI decisions.",
    },
    {
      icon: Lock,
      title: "Privacy by Design",
      description:
        "All user data in EduDev is treated with strict privacy standards and never used improperly.",
    },
    {
      icon: Scale,
      title: "Ethical Alignment",
      description:
        "Our models follow human-centered principles, ensuring fairness and inclusivity.",
    },
    {
      icon: Users,
      title: "Human Oversight",
      description:
        "Critical decisions are monitored by our team to maintain accuracy and safety.",
    },
    {
      icon: FileCheck,
      title: "Continuous Monitoring",
      description:
        "We constantly evaluate model performance and behavior to protect users.",
    },
  ];

  const safetyLayers = [
    {
      title: "Pre-Training Safety",
      items: [
        "Filter and curate high-quality educational data",
        "Detect and mitigate bias in learning datasets",
        "Protect user data and maintain privacy",
        "Follow secure data handling practices",
      ],
    },
    {
      title: "Training Safety",
      items: [
        "Align models with educational and ethical guidelines",
        "Use human feedback to improve responses",
        "Conduct internal safety tests",
        "Simulate real-world scenarios to avoid errors",
      ],
    },
    {
      title: "Deployment Safety",
      items: [
        "Content moderation for safe learning",
        "Rate limits to prevent misuse",
        "User feedback integration",
        "Emergency rollback if needed",
      ],
    },
    {
      title: "Post-Deployment",
      items: [
        "Continuous evaluation of model outputs",
        "Safety audits to ensure compliance",
        "Incident response for any issues",
        "Community-driven feedback to improve models",
      ],
    },
  ];

  const researchPillars = [
    {
      title: "Robustness",
      description:
        "Ensuring EduDev models respond reliably across different learning scenarios",
      progress: 85,
    },
    {
      title: "Alignment",
      description: "Making AI outputs follow ethical and educational standards",
      progress: 78,
    },
    {
      title: "Monitoring",
      description: "Tools to track model behavior and prevent unsafe outputs",
      progress: 92,
    },
    {
      title: "Interpretability",
      description:
        "Helping users understand why EduDev provides certain suggestions",
      progress: 67,
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
                Safety First
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-medium text-white mb-6"
            >
              Our Approach to
              <br />
              <span className="text-white/60">AI Safety</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              At EduDev, safety is at the heart of everything we do. We develop
              AI models that are reliable, ethical, and beneficial for learners,
              developers, and the global community.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href={`#scroll-safety`}>
                <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full">
                  Explore EduDev Safety <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/support`}>
                <Button
                  variant="outline"
                  className="border-white/20 cursor-pointer text-white hover:bg-white/10 px-8 py-6 rounded-full"
                >
                  Contact Support
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Safety Principles */}
      <section className="py-20 border-t border-white/10" id="scroll-safety">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-white/20 text-white/80"
            >
              Core Principles
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              Guiding our safety work
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              These principles form the foundation of our safety approach,
              ensuring responsible AI development.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <principle.icon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  {principle.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Safety Layers */}
      <section className="py-20 border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-white/20 text-white/80"
            >
              Multi-Layer Safety
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              Safety at every stage
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Our comprehensive safety framework spans the entire AI lifecycle.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {safetyLayers.map((layer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-black border border-white/10"
              >
                <h3 className="text-2xl font-medium text-white mb-6">
                  {layer.title}
                </h3>
                <ul className="space-y-4">
                  {layer.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.1 }}
                      className="flex items-center gap-3 text-white/60"
                    >
                      <CheckCircle className="w-4 h-4 text-white/40 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Focus */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge
              variant="outline"
              className="mb-4 border-white/20 text-white/80"
            >
              Research Focus
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              Advancing safety research
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              We're continuously investing in research to make AI systems safer
              and more reliable.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {researchPillars.map((pillar, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">{pillar.title}</span>
                    <span className="text-white/40">{pillar.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pillar.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  <p className="text-sm text-white/40">{pillar.description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-medium text-white mb-4">
                Latest Safety Publications
              </h3>
              <ul className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <li
                    key={i}
                    className="border-b border-white/10 pb-4 last:border-0"
                  >
                    <Link href="#" className="group flex items-start gap-3">
                      <BookOpen className="w-4 h-4 text-white/40 mt-1 group-hover:text-white transition-colors" />
                      <div>
                        <h4 className="text-white group-hover:text-white/80 transition-colors">
                          Towards Robust AI Systems: A Multi-Layer Safety
                          Approach
                        </h4>
                        <p className="text-xs text-white/40 mt-1">
                          Published May 2024 • 15 min read
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="#"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white mt-4 group"
              >
                View all publications
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-20 border-t border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl border border-white/10"
          >
            <AlertTriangle className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h2 className="text-3xl font-medium text-white mb-4">
              Report a Safety Concern
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              If you encounter any safety or content issues while using EduDev
              models, please let us know. Your reports help us maintain a secure
              and responsible AI environment for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full">
                  Report an Issue
                </Button>
              </Link>
              <Link href={`/safety/security`}>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full"
                >
                  View EduDev Safety Policy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default SafetyApproachPage;
