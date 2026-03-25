"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Send, ChevronRight } from "lucide-react";

const Hero = () => {
  const [prompt, setPrompt] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const placeholderTexts = [
    "Ask anything...",
    "Write a blog post...",
    "Analyze data...",
    "Generate code...",
    "Create a strategy...",
  ];

  // Typewriter effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isFocused) {
      const currentFullText = placeholderTexts[currentPlaceholderIndex];

      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 70);
      } else {
        timeout = setTimeout(() => {
          setDisplayText("");
          setCurrentPlaceholderIndex(
            (prev) => (prev + 1) % placeholderTexts.length,
          );
        }, 2000);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentPlaceholderIndex, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const encodedPrompt = encodeURIComponent(prompt);
      window.open(`/chat/?q=${encodedPrompt}`, "_blank");
      setPrompt("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Animation variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const suggestions = [
    "Explain quantum computing",
    "Write a python script",
    "Create marketing copy",
    "Analyze market trends",
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Clean background with subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-black" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black to-transparent" />
      </div>

      {/* Subtle grid pattern - very faint */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${isFocused ? "#e5e5e5" : "#f5f5f5"} 1px, transparent 1px), linear-gradient(to bottom, ${isFocused ? "#e5e5e5" : "#f5f5f5"} 1px, transparent 1px)`,
          backgroundSize: "4rem 4rem",
          opacity: 0.15,
          maskImage:
            "radial-gradient(ellipse at center, black, transparent 70%)",
        }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity, scale, y }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28"
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUpVariants}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Introducing EduDev AI 3.5
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUpVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Advanced AI for
            <br />
            complex reasoning
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={fadeUpVariants}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Our latest model delivers breakthrough capabilities in science,
            coding, and math—solving problems that were previously out of reach.
          </motion.p>

          {/* Prompt Input - Clean OpenAI Style */}
          <motion.div
            variants={fadeUpVariants}
            className="max-w-3xl mx-auto mb-8"
          >
            <form onSubmit={handleSubmit}>
              <div
                className={`
                                relative group transition-all duration-200
                                ${isFocused ? "scale-[1.02]" : ""}
                            `}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isFocused ? "Message OpenAI..." : displayText}
                  className="w-full px-5 py-4 pb-16 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-slate-800 rounded-2xl pr-14 focus:outline-none focus:border-slate-300 dark:focus:border-slate-700 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-900 dark:text-white shadow-sm"
                />

                <motion.button
                  type="submit"
                  disabled={!prompt.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                                        absolute right-3 bottom-1 transform -translate-y-1/2
                                        p-2 rounded-xl transition-all duration-200
                                        ${
                                          prompt.trim()
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 cursor-pointer shadow-sm"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                                        }
                                    `}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </form>

            {/* Suggestions */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-wrap gap-2 justify-center mt-3"
            >
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Trust indicator */}
          {/* <motion.div
                        variants={fadeUpVariants}
                        className="mt-16"
                    >
                        <p className="text-xs text-slate-400 dark:text-slate-600 mb-4 tracking-wide">
                            Trusted by teams at
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 items-center">
                            {['Microsoft', 'Shopify', 'Airbnb', 'Spotify'].map((company, i) => (
                                <motion.span
                                    key={i}
                                    whileHover={{ opacity: 1 }}
                                    className="text-sm text-slate-400 dark:text-slate-600 font-medium opacity-60 transition-opacity"
                                >
                                    {company}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div> */}
        </motion.div>
      </motion.div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <div className="w-4 h-7 border border-slate-300 dark:border-slate-700 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full mt-1.5"
          />
        </div>
      </motion.div>

      {/* Keyboard shortcut hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 right-8 hidden lg:block text-xs text-slate-400 dark:text-slate-600"
      >
        <span className="border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5">
          ⌘
        </span>
        <span className="border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 ml-1">
          K
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
