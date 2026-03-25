"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, Eye, Heart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BlogPost } from '@/types/blog';
import { urlForImage } from '@/lib/sanity/image';
import { NewsPost } from '@/lib/sanity/fetchLatestNews';

interface FeaturedBlogSectionProps {
    featuredPost: BlogPost | null;
    latestPosts: NewsPost[];
}

const FeaturedBlogSection: React.FC<FeaturedBlogSectionProps> = ({
    featuredPost,
    latestPosts
}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

   
    return (
        <section className="relative py-24 bg-black overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black" />
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="mb-4 border-white/20 text-white/80">
                        Our Blog
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-medium text-white mb-4">
                        Latest from our blog
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Insights, tutorials, and updates from our team of experts
                    </p>
                </motion.div>

                {/* Featured Layout */}
                {/* Blog Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {latestPosts.map((blog) => (
                        <motion.div
                            key={blog.id}
                            variants={cardVariants}
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="h-full bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden group">
                                <div className="relative aspect-[16/9] overflow-hidden">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Image
                                            src={blog.image}
                                            alt={blog.title}
                                            fill
                                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                    </motion.div>
                                    <Badge className="absolute top-4 left-4 bg-black/80 text-white border-white/20">
                                        {blog.category}
                                    </Badge>
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {blog.publishedAt ? formatDate(blog.publishedAt) : blog.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {blog.readTime || '5 min read'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-medium text-white mb-2 group-hover:text-white/80 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>

                                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                                        {blog.excerpt}
                                    </p>
                                </CardContent>

                                <CardFooter className="px-6 pb-6 pt-0 flex items-center justify-between">
                                    <Link
                                        href={`/blog/${blog.id}`}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedBlogSection;