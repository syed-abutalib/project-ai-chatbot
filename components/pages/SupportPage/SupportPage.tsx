// app/support/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Mail,
  MessageCircle,
  ChevronDown,
  Send,
  CheckCircle,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Phone,
  ExternalLink,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setSubmitStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 3000);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus({
        type: "error",
        message: "Please enter a valid email address",
      });
      setTimeout(() => setSubmitStatus({ type: null, message: "" }), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "Message sent successfully! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  const faqs = [
    {
      question: "What is EduDev?",
      answer:
        "EduDev is an AI platform that gives you access to multiple models like EduDev 3.5, 3.0, and OpenSource models in one place for coding, learning, and productivity.",
    },
    {
      question: "Which model should I use?",
      answer:
        "Use EduDev 3.5 for best performance, EduDev 3.0 for balanced tasks, and EduDev OpenSource for free usage.",
    },
    {
      question: "Is EduDev free to use?",
      answer:
        "Yes, we offer a free OpenSource model. Premium models are available after login.",
    },
    {
      question: "Why do I need to log in?",
      answer:
        "Login unlocks premium models like EduDev 3.5 and 3.0 and allows you to save chats and access more features.",
    },
    {
      question: "Can I use EduDev for coding help?",
      answer:
        "Yes, EduDev is optimized for developers and students to help with coding, debugging, and learning new concepts.",
    },
    {
      question: "Why is my response slow sometimes?",
      answer:
        "Response time depends on the selected model and server load. Premium models are generally faster and more reliable.",
    },
  ];

  const resources = [
    {
      icon: MessageSquare,
      title: "AI Chat Help",
      description:
        "Ask EduDev directly for help with coding, learning, or anything else",
      link: "/chat",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other users, share ideas, and learn together",
      link: "/",
    },
    {
      icon: HelpCircle,
      title: "Getting Started",
      description: "Learn how to use EduDev models effectively",
      link: "/",
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
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <main className="min-h-screen bg-black pt-24">
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
                Help & Support
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl md:text-7xl font-medium text-white mb-6"
            >
              How can we
              <br />
              <span className="text-white/60">help you today?</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Get the support you need with our comprehensive documentation,
              community forum, and direct support channels.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Resources */}
      <section className="py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <resource.icon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">
                  {resource.title}
                </h3>
                <p className="text-white/40 text-sm mb-4">
                  {resource.description}
                </p>
                <Link
                  href={resource.link}
                  className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group/link"
                >
                  Learn more
                  <ExternalLink className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & FAQs */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
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
                Contact Us
              </Badge>
              <h2 className="text-3xl font-medium text-white mb-4">
                Send us a message
              </h2>
              <p className="text-white/60 mb-8">
                Fill out the form below and we'll get back to you within 24
                hours.
              </p>

              {/* Status Message */}
              <AnimatePresence>
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{submitStatus.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/20 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/20 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/20 focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Your message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/20 focus:ring-0 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-white/90 py-6 rounded-xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* FAQs */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge
                variant="outline"
                className="mb-4 border-white/20 text-white/80"
              >
                FAQs
              </Badge>
              <h2 className="text-3xl font-medium text-white mb-4">
                Frequently asked questions
              </h2>
              <p className="text-white/60 mb-8">
                Quick answers to common questions about our platform and
                services.
              </p>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-white/10 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setOpenFaq(openFaq === index ? null : index)
                      }
                      className="w-full flex items-center justify-between p-4 text-left bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-white font-medium">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                          openFaq === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="p-4 text-white/40 text-sm bg-white/5 border-t border-white/10">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HelpCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h2 className="text-3xl font-medium text-white mb-4">
              Still need help?
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              Still stuck? We’re here to help you get the most out of EduDev.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button className="bg-white text-black hover:bg-white/90 px-8 py-6 rounded-full cursor-pointer">
                  <MessageCircle className="mr-2 w-4 h-4" />
                  Chat with AI
                </Button>
              </Link>
              <a href="mailto:syedabutalib.dev@gmail.com" target="_blank">
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full"
                >
                  <Mail className="mr-2 w-4 h-4" />
                  Email support
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default SupportPage;
