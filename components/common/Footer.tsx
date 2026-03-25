// components/footer.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Heart,
  Globe,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const companyLinks = [
    { name: "About", href: "/company" },
    { name: "Chat", href: "/chat" },
    { name: "News", href: "/news" },
    { name: "Support", href: "/support" },
  ];

  const productLinks = [
    { name: "EduDev 3.5 Product", href: "/chat" },
    { name: "EduDev 3.0 Product", href: "/chat" },
    { name: "EduDev 2.5 Product", href: "/chat" },
  ];

  //   const resourcesLinks = [
  //     { name: "Documentation", href: "/docs" },
  //     { name: "API Reference", href: "/api" },
  //     { name: "Guides", href: "/guides" },
  //     { name: "Support", href: "/support" },
  //     { name: "Status", href: "/status" },
  //   ];

  const legalLinks = [
    { name: "Safety & Approach", href: "/safety/approach" },
    { name: "Safety & Security", href: "/safety/security" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/syed-abutalib", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/syed-abutalib-ba497b322",
      label: "LinkedIn",
    },
  ];

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

  const linkHoverVariants = {
    hover: {
      x: 5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
        />
      </div>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={scrollToTop}
        className="absolute top-6 right-6 z-20 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/60 hover:text-white transition-all duration-300 group"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronUp className="w-5 h-5 group-hover:animate-bounce" />
      </motion.button>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 mb-6 group"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={(100 * 90) / 50}
                height={100}
              />
            </Link>

            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Advanced AI platform for modern enterprises. Transform your
              workflow with cutting-edge technology and enterprise-grade
              security.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/40 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-medium mb-4">Product</h3>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          {/* <motion.div variants={itemVariants}>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div> */}

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-medium mb-4">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <motion.li
                  key={link.name}
                  variants={linkHoverVariants}
                  whileHover="hover"
                >
                  <Link
                    href={link.href}
                    className="text-white/40 hover:text-white text-sm transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            {/* Copyright */}
            <p className="text-white/30 text-xs text-center md:text-left">
              © {new Date().getFullYear()} EduDev. All rights reserved. Built
              with <Heart className="w-3 h-3 inline-block text-white/40 mx-1" />{" "}
              for the future of AI.
            </p>
          </div>

          {/* Trust Badges */}
          {/* <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            {["SOC2", "GDPR", "ISO 27001", "HIPAA"].map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/40 text-xs"
              >
                {badge}
              </motion.div>
            ))}
          </div> */}
        </motion.div>
      </div>

      {/* Decorative bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </footer>
  );
};

export default Footer;
