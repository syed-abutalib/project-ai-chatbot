// components/sections/get-started-banner.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Users,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const GetStartedBanner = () => {
  const features = [
    { icon: Zap, text: "Lightning fast inference" },
    { icon: Shield, text: "Enterprise-grade security" },
    { icon: Users, text: "Team collaboration" },
    { icon: Sparkles, text: "Latest AI models" },
  ];

  const benefits = ["No credit card required", "24/7 support"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Glowing orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative"
        >
          {/* Main Content Card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10 text-center">
              {/* Badge */}
              <motion.div
                variants={itemVariants}
                className="flex justify-center mb-6"
              >
                <Badge
                  variant="outline"
                  className="border-white/20 text-white/80 px-4 py-1"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  Limited Time Offer
                </Badge>
              </motion.div>

              {/* Heading */}
              <motion.h2
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6"
              >
                Ready to get started?
                <br />
                <span className="text-white/60">Join thousands of teams</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed"
              >
                Experience the power of advanced AI with enterprise-grade
                security and performance. Start building better products today.
              </motion.p>

              {/* Feature Pills */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-3 justify-center mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
                  >
                    <feature.icon className="w-4 h-4" />
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
              >
                <Link href={`/chat`}>
                  <Button
                    size="lg"
                    className="bg-white hover:bg-white/90 text-black px-8 py-6 text-base rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group w-full sm:w-auto"
                  >
                    Start using our ai
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/support">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/30 hover:bg-white/10 text-white px-8 py-6 text-base rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                  >
                    Contact sales
                  </Button>
                </Link>
              </motion.div>

              {/* Benefits Grid */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-1 gap-4 max-w-2xl mx-auto"
              >
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-white/40" />
                    <span className="text-white/60">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={itemVariants}
                className="mt-8 pt-8 border-t border-white/10"
              >
                <p className="text-sm text-white/40 mb-4">
                  Trusted by leading companies
                </p>
                <div className="flex justify-center items-center gap-8 flex-wrap">
                  {["Microsoft", "Google", "Amazon", "Meta"].map(
                    (company, i) => (
                      <span
                        key={i}
                        className="text-white/20 text-sm font-medium"
                      >
                        {company}
                      </span>
                    ),
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStartedBanner;
