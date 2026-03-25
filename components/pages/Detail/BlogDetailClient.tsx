// app/news/[slug]/BlogDetailClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Link2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PortableText } from "@portabletext/react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    image: string | null;
  } | null;
  publishedAt: string;
}

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: any[];
}

const BlogDetailClient: React.FC<BlogDetailClientProps> = ({
  post,
  relatedPosts,
}) => {
  const { scrollYProgress } = useScroll();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], [0, 8]);
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] },
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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;

    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
    setShowShareMenu(false);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Portable Text components for rich content
  const ptComponents = {
    types: {
      image: ({ value }: any) => (
        <div className="my-8 relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={value.asset?.url || ""}
            alt={value.alt || "Blog image"}
            fill
            className="object-cover"
          />
        </div>
      ),
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold text-white mt-12 mb-6">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-bold text-white mt-10 mb-5">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-bold text-white mt-6 mb-3">{children}</h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-white/70 leading-relaxed mb-6 text-lg">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-white/20 pl-6 my-8 italic text-white/80 text-lg">
          {children}
        </blockquote>
      ),
    },
    marks: {
      link: ({ children, value }: any) => (
        <a
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white underline underline-offset-4 hover:text-white/70 transition-colors"
        >
          {children}
        </a>
      ),
      strong: ({ children }: any) => (
        <strong className="font-bold text-white">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic text-white/90">{children}</em>
      ),
      code: ({ children }: any) => (
        <code className="bg-white/5 px-2 py-1 rounded-md text-sm font-mono text-white/80">
          {children}
        </code>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside text-white/70 mb-6 space-y-2">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside text-white/70 mb-6 space-y-2">
          {children}
        </ol>
      ),
    },
  };

  return (
    <main className="min-h-screen bg-black ">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Sticky header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
          backgroundColor: useTransform(
            scrollYProgress,
            [0, 0.1],
            ["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"],
          ),
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/news"
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to news</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={handleBookmark}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-white" : ""}`}
              />
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/5"
                onClick={() => setShowShareMenu(!showShareMenu)}
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                >
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-sm">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-full px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-full px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3"
                  >
                    <Link2 className="w-4 h-4" />
                    <span className="text-sm">Copy link</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Image with Parallax */}
      <div className="relative h-[98vh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover object-top"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
            style={{ opacity: imageOpacity }}
          />
        </motion.div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl"
            >
              <Badge
                variant="outline"
                className="mb-6 border-white/20 text-white/80"
              >
                Article
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-white/60 mb-8 max-w-2xl">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-6 text-white/40">
                {post.author && (
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/90 border-white/20 text-white/80 flex items-center gap-2">
                      <span className="text-sm text-black">
                        {post.author.name}
                      </span>
                    </Badge>
                  </div>
                )}
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{post.date}</span>
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{post.readTime}</span>
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="prose prose-invert prose-lg max-w-none"
          >
            {post.content ? (
              <PortableText value={post.content} components={ptComponents} />
            ) : (
              <div className="space-y-6 text-white/70">
                <p>Content not available.</p>
              </div>
            )}
          </motion.div>

          {/* Article Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="border-white/20 text-white/60"
                >
                  Share this article
                </Badge>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/40 hover:text-white hover:bg-white/5"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/40 hover:text-white hover:bg-white/5"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/40 hover:text-white hover:bg-white/5"
                    onClick={() => handleShare("copy")}
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-white/40 hover:text-white hover:bg-white/5"
                onClick={handleBookmark}
              >
                <Bookmark
                  className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-white" : ""}`}
                />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-20 border-t border-white/10 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge
                variant="outline"
                className="mb-4 border-white/20 text-white/80"
              >
                Continue Reading
              </Badge>
              <h2 className="text-3xl font-medium text-white mb-4">
                Related articles
              </h2>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {relatedPosts.map((related, index) => (
                <motion.div
                  key={related._id}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/news/${related.slug}`}>
                    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden h-full">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={related.image}
                          alt={related.title}
                          fill
                          className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {related.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {related.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-sm text-white/40 line-clamp-2">
                          {related.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </main>
  );
};

export default BlogDetailClient;
