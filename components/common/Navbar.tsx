// components/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    // Check system preference for dark theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkTheme(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDarkTheme(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Company", href: "/company" },
    { name: "News", href: "/news" },
    { name: "Support", href: "/support" },
    {
      name: "Safety",
      href: "/safety",
      dropdown: [
        { name: "Safety Approach", href: "/safety/approach" },
        { name: "Security & Approach", href: "/safety/security" },
      ],
    },
  ];

  // Theme-based classes
  const theme = {
    bg: isDarkTheme ? "#000" : "#fff",
    bgLight: isDarkTheme ? "#111" : "#f2f2f2",
    bgLighter: isDarkTheme ? "#222" : "#fff",
    text: isDarkTheme ? "#fff" : "#000",
    textMuted: isDarkTheme ? "#eee" : "#333",
    textLight: isDarkTheme ? "#f2f2f2" : "#666",
    border: isDarkTheme ? "#333" : "#eee",
    borderLight: isDarkTheme ? "#222" : "#f2f2f2",
    hover: isDarkTheme ? "#222" : "#f2f2f2",
    overlay: isDarkTheme ? "rgba(0,0,0,0.9)" : "rgba(255,255,255,0.9)",
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ backgroundColor: isScrolled ? theme.overlay : "transparent" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-xl ${
        isScrolled ? `shadow-lg border-b` : ""
      }`}
      style={{
        borderColor: theme.borderLight,
        boxShadow: isScrolled
          ? `0 4px 20px ${isDarkTheme ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
          : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
        <div className="flex items-center lg:flex lg:items-center lg:justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="md:w-44 h-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <div className="flex items-center justify-end lg:justify-center flex-1">
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
                className="flex items-center space-x-1"
              >
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="relative"
                  >
                    {link.dropdown ? (
                      <div
                        className="relative"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                      >
                        <button
                          style={{ color: theme.textMuted }}
                          className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group hover:bg-opacity-10"
                          style={{
                            backgroundColor: isDropdownOpen
                              ? theme.hover
                              : "transparent",
                            color: isDropdownOpen
                              ? theme.text
                              : theme.textMuted,
                          }}
                        >
                          {link.name}
                          <ChevronDown
                            style={{ color: theme.textMuted }}
                            className={`ml-1 w-4 h-4 transition-all duration-300 ${
                              isDropdownOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown that opens from top to 25% screen below */}
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              variants={dropdownVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              className="absolute top-full left-0 mt-2 overflow-hidden"
                              style={{ width: "240px" }}
                            >
                              <div
                                style={{
                                  backgroundColor: theme.bgLighter,
                                  borderColor: theme.border,
                                  boxShadow: `0 10px 30px ${isDarkTheme ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.1)"}`,
                                }}
                                className="rounded-xl border py-2"
                              >
                                {link.dropdown.map((item, idx) => (
                                  <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                  >
                                    <Link
                                      href={item.href}
                                      style={{ color: theme.textMuted }}
                                      className="block px-4 py-2.5 text-sm transition-all duration-200 hover:pl-6"
                                      style={{
                                        backgroundColor: "transparent",
                                        color: theme.textMuted,
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          theme.hover;
                                        e.currentTarget.style.color =
                                          theme.text;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "transparent";
                                        e.currentTarget.style.color =
                                          theme.textMuted;
                                      }}
                                    >
                                      {item.name}
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        style={{ color: theme.textMuted }}
                        className="block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-opacity-10"
                        style={{
                          backgroundColor: "transparent",
                          color: theme.textMuted,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme.hover;
                          e.currentTarget.style.color = theme.text;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = theme.textMuted;
                        }}
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
            <div className="flex items-end justify-end">
              {/* Desktop Right Buttons */}
              <Show when="signed-out">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="hidden lg:flex lg:items-center lg:space-x-3"
                >
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      style={{
                        color: theme.textMuted,
                        backgroundColor: "transparent",
                      }}
                      className="font-medium px-5 py-2.5 rounded-lg transition-all duration-200 hover:bg-opacity-10"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.hover;
                        e.currentTarget.style.color = theme.text;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = theme.textMuted;
                      }}
                    >
                      Login
                    </Button>
                  </SignInButton>

                  <Button
                    style={{
                      backgroundColor: theme.text,
                      color: theme.bg,
                      boxShadow: `0 4px 14px ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                    onClick={() => (window.location.href = "/chat")}
                    className="font-medium px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                  >
                    Try our AI
                    <Sparkles
                      className="ml-2 w-4 h-4"
                      style={{ color: theme.bg }}
                    />
                  </Button>
                </motion.div>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-4">
                  <Button
                    style={{
                      backgroundColor: theme.text,
                      color: theme.bg,
                      boxShadow: `0 4px 14px ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    }}
                    onClick={() => (window.location.href = "/chat")}
                    className="hidden lg:flex font-medium px-5 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                  >
                    Try our AI
                    <Sparkles
                      className="ml-2 w-4 h-4"
                      style={{ color: theme.bg }}
                    />
                  </Button>
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ color: theme.textMuted }}
                  className="hover:bg-opacity-10"
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = theme.hover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-96 p-0"
                style={{
                  backgroundColor: theme.bgLight,
                  borderColor: theme.border,
                }}
              >
                <SheetHeader
                  className="border-b p-6"
                  style={{ borderColor: theme.border }}
                >
                  <SheetTitle className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                      <Image
                        src="/logo.png"
                        alt="Logo"
                        width={100}
                        height={52}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col h-full">
                  <nav className="flex-1 overflow-y-auto py-6 px-6">
                    <ul className="space-y-2">
                      {navLinks.map((link, index) => (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {link.dropdown ? (
                            <div className="space-y-2">
                              <div
                                style={{
                                  backgroundColor: theme.hover,
                                  color: theme.text,
                                }}
                                className="font-medium px-4 py-3 rounded-lg"
                              >
                                {link.name}
                              </div>
                              <ul className="ml-4 space-y-1">
                                {link.dropdown.map((item) => (
                                  <li key={item.name}>
                                    <Link
                                      href={item.href}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      style={{ color: theme.textMuted }}
                                      className="block px-4 py-3 text-sm rounded-lg transition-all duration-200"
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          theme.hover;
                                        e.currentTarget.style.color =
                                          theme.text;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                          "transparent";
                                        e.currentTarget.style.color =
                                          theme.textMuted;
                                      }}
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <Link
                              href={link.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              style={{ color: theme.textMuted }}
                              className="block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  theme.hover;
                                e.currentTarget.style.color = theme.text;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.color = theme.textMuted;
                              }}
                            >
                              {link.name}
                            </Link>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </nav>

                  {/* Mobile Action Buttons */}
                  <Show when="signed-out">
                    <div
                      className="border-t p-6 space-y-3"
                      style={{ borderColor: theme.border }}
                    >
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          style={{
                            color: theme.textMuted,
                            borderColor: theme.border,
                            backgroundColor: "transparent",
                          }}
                          className="w-full justify-center font-medium py-6 rounded-xl transition-all duration-200"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme.hover;
                            e.currentTarget.style.color = theme.text;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = theme.textMuted;
                          }}
                        >
                          Login
                        </Button>
                      </SignInButton>
                      <Button
                        onClick={() => (window.location.href = "/chat")}
                        style={{
                          backgroundColor: theme.text,
                          color: theme.bg,
                          boxShadow: `0 4px 14px ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        }}
                        className="w-full justify-center font-medium py-6 rounded-xl transition-all duration-200"
                      >
                        Try our AI
                        <Sparkles
                          className="ml-2 w-4 h-4"
                          style={{ color: theme.bg }}
                        />
                      </Button>
                    </div>
                  </Show>
                  <Show when="signed-in">
                    <div
                      className="border-t p-6 space-y-3"
                      style={{ borderColor: theme.border }}
                    >
                      <Button
                        onClick={() => (window.location.href = "/chat")}
                        style={{
                          backgroundColor: theme.text,
                          color: theme.bg,
                          boxShadow: `0 4px 14px ${isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        }}
                        className="w-full justify-center font-medium py-6 rounded-xl transition-all duration-200 cursor-pointer"
                      >
                        Try our AI
                        <Sparkles
                          className="ml-2 w-4 h-4"
                          style={{ color: theme.bg }}
                        />
                      </Button>
                    </div>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
