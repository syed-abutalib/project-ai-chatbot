// app/company/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CompanyPage = () => {
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

  const values = [
    {
      title: "Developer First",
      description:
        "Everything we build is designed for developers and learners.",
    },
    {
      title: "Affordable AI",
      description: "We provide powerful AI models at low or no cost.",
    },
    {
      title: "Speed & Performance",
      description: "Fast responses powered by optimized AI models.",
    },
    {
      title: "Open Access",
      description: "We support open-source and accessible AI.",
    },
    {
      title: "Learning Focused",
      description: "Helping students and coders grow every day.",
    },
    {
      title: "Innovation",
      description: "Constantly improving AI experiences.",
    },
  ];

  return (
    <main className="min-h-screen bg-black pt-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
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
                About Us
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-medium text-white mb-6"
            >
              Shaping the future
              <br />
              <span className="text-white/60">of artificial intelligence</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              EduDev is an AI-powered platform designed to help developers,
              students, and creators learn, build, and grow faster with
              intelligent tools.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Link href="/support">
                <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full">
                  Join our team
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/support">
                <Button
                  variant="outline"
                  className="border-white/20 cursor-pointer text-white hover:bg-white/10 px-8 py-6 rounded-full"
                >
                  Contact us
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="mb-4 border-white/20 text-white/80"
              >
                Our Mission
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-medium text-white mb-6">
                Making AI work for everyone
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-6">
                At EduDev, we believe artificial intelligence should be
                accessible, practical, and built for real-world use. Our goal is
                to empower developers, students, and creators with AI tools that
                simplify learning, coding, and problem-solving.
              </p>
              <p className="text-white/40 leading-relaxed">
                We focus on delivering fast, reliable, and affordable AI
                experiences by integrating powerful models into a single
                platform. Whether you're building projects, (learning), or
                exploring new ideas, EduDev helps you move faster and smarter.
                Built by developers for developers, EduDev is growing as a
                platform that makes advanced AI simple, useful, and available to
                everyone.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className=" rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
                <Image
                  src="/why-work.webp"
                  alt="Our Mission"
                  width={800}
                  height={1000}
                  className="object-cover opacity-80"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
              What we believe in
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              These core principles guide everything we do, from research to
              product development.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <h3 className="text-xl font-medium text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}

      {/* CTA Section */}
      {/* <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge
              variant="outline"
              className="mb-6 border-white/20 text-white/80"
            >
              Join Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-medium text-white mb-6">
              Help shape the future of AI
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
              We're always looking for passionate individuals to join our
              mission. Check out our open positions and become part of something
              bigger.
            </p>
            <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full">
              View open positions
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section> */}
    </main>
  );
};

export default CompanyPage;
