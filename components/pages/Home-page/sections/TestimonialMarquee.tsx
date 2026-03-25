// components/sections/testimonial-marquee.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const TestimonialMarquee = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "CTO at TechFlow",
      content:
        "This platform has completely transformed our workflow. The AI capabilities are unprecedented.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "TechFlow",
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Head of Product at InnovateCo",
      content:
        "The integration was seamless and the results were immediate. Our productivity has increased by 200%.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "InnovateCo",
    },
    {
      id: 3,
      name: "David Kim",
      role: "Lead Engineer at BuildScale",
      content:
        "Best AI platform we've ever used. The support team is exceptional and always helpful.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "BuildScale",
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Data Scientist at AnalyticsPro",
      content:
        "The accuracy and speed of the models are incredible. It's like having a team of experts.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "AnalyticsPro",
    },
    {
      id: 5,
      name: "James Chen",
      role: "CEO at StartupX",
      content:
        "This tool has been game-changing for our startup. We've scaled faster than ever.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "StartupX",
    },
    {
      id: 6,
      name: "Emma Roberts",
      role: "Product Manager at DesignHub",
      content:
        "The AI suggestions are always relevant and help us make better decisions faster.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "DesignHub",
    },
    {
      id: 7,
      name: "Liam Johnson",
      role: "COO at Innovatek",
      content:
        "Our operational efficiency improved dramatically thanks to the intelligent automation features.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "Innovatek",
    },
    {
      id: 8,
      name: "Sophia Martinez",
      role: "UX Lead at PixelCraft",
      content:
        "The AI-driven insights completely changed the way we design user experiences. Exceptional tool!",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "PixelCraft",
    },
    {
      id: 9,
      name: "Ethan Brown",
      role: "Software Architect at CodeSphere",
      content:
        "The platform is robust, reliable, and has significantly reduced our development time.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "CodeSphere",
    },
    {
      id: 10,
      name: "Olivia Davis",
      role: "Marketing Director at BrandHive",
      content:
        "AI insights helped us craft campaigns that resonate perfectly with our audience. Amazing results!",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "BrandHive",
    },
    {
      id: 11,
      name: "Noah Wilson",
      role: "Head of AI at NeuralNetics",
      content:
        "The model accuracy and customization options are top-notch. We've seen great ROI since adoption.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "NeuralNetics",
    },
    {
      id: 12,
      name: "Ava Thompson",
      role: "Operations Manager at QuantumLeap",
      content:
        "The platform is intuitive and the AI recommendations are spot-on. It has simplified our daily workflows.",
      rating: 5,
      avatar: "/api/placeholder/48/48",
      company: "QuantumLeap",
    },
  ];

  const firstRow = testimonials.slice(0, 3);
  const secondRow = testimonials.slice(3, 6);

  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  const marqueeVariants2 = {
    animate: {
      x: [-1000, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  return (
    <section className="relative py-24 bg-black overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge
            variant="outline"
            className="mb-4 border-white/20 text-white/80"
          >
            Testimonials
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
            Loved by clients
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Join thousands of satisfied teams building better products with our
            platform
          </p>
        </motion.div>
      </div>

      {/* Marquee Rows */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

        {/* First Row - Left to Right */}
        <div className="overflow-hidden mb-6">
          <motion.div
            variants={marqueeVariants}
            animate="animate"
            className="flex gap-6 w-max"
          >
            {[...firstRow, ...firstRow, ...firstRow].map(
              (testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-[350px] flex-shrink-0"
                >
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <Quote className="w-8 h-8 text-white/20 mb-4" />

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-white text-white"
                        />
                      ))}
                    </div>

                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </motion.div>
        </div>

        {/* Second Row - Right to Left */}
        <div className="overflow-hidden">
          <motion.div
            variants={marqueeVariants2}
            animate="animate"
            className="flex gap-6 w-max"
          >
            {[...secondRow, ...secondRow, ...secondRow].map(
              (testimonial, index) => (
                <div
                  key={`${testimonial.id}-${index}`}
                  className="w-[350px] flex-shrink-0"
                >
                  <div className="bg-white/5 h-full border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <Quote className="w-8 h-8 text-white/20 mb-4" />

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-white text-white"
                        />
                      ))}
                    </div>

                    <p className="text-white/80 text-sm leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ),
            )}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "10K+", label: "Active users" },
            { value: "98%", label: "Customer satisfaction" },
            { value: "50M+", label: "API calls" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-medium text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialMarquee;
