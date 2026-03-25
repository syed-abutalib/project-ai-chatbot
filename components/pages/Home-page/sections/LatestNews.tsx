// components/sections/latest-news.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { NewsPost } from '@/lib/sanity/fetchLatestNews';

interface LatestNewsProps {
  featuredNews: NewsPost;
  latestPosts: NewsPost[];
}

const LatestNews: React.FC<LatestNewsProps> = ({ featuredNews, latestPosts }) => {
    return (
        <section className="relative py-8 bg-black overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-white/20 text-white/80">
                        Latest Updates
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
                        Latest News
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Stay updated with our latest developments and product updates
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Sticky Left Column - Featured Post */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit">
                        <motion.article
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group"
                        >
                            <Link href={`/news/${featuredNews.slug || featuredNews.id}`}>
                                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-2xl bg-white/5 border border-white/10">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={featuredNews.image}
                                            alt={featuredNews.title}
                                            fill
                                            className="object-cover opacity-80"
                                        />
                                    </motion.div>
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-black/80 text-white border-white/20">
                                            {featuredNews.category}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-xs text-white/50">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {featuredNews.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {featuredNews.readTime}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-medium text-white group-hover:text-white/80 transition-colors">
                                        {featuredNews.title}
                                    </h3>

                                    <p className="text-white/60 text-sm leading-relaxed">
                                        {featuredNews.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </motion.article>
                    </div>

                    {/* Right Column - Stacking Cards */}
                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            {latestPosts.map((post, index) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                        ease: "easeOut"
                                    }}
                                    whileHover={{
                                        scale: 1.02,
                                        transition: { duration: 0.2 }
                                    }}
                                    className="group"
                                >
                                    <Link href={`/news/${post.slug || post.id}`}>
                                        <article className="grid md:grid-cols-2 gap-5 p-0 mb-6 transition-all duration-300">
                                            <div className="md:col-span-1">
                                                <div className="relative aspect-[16/9] w-96 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                                                    <motion.div
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute inset-0"
                                                    >
                                                        <Image
                                                            src={post.image}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover opacity-80 w-96"
                                                        />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 space-y-3">
                                                <h3 className="text-lg font-medium text-white group-hover:text-white/80 transition-colors">
                                                    {post.title}
                                                </h3>
                                                {/* <p className="text-sm text-white/60 line-clamp-2">
                                                    {post.excerpt}
                                                </p> */}

                                                <div className="flex items-center gap-3 pt-2">
                                                    <Badge variant="outline" className="border-white/20 text-white/70">
                                                        {"Company"}
                                                    </Badge>

                                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {post.readTime}
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LatestNews;