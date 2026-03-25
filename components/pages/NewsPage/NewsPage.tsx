// app/news/NewsClient.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface NewsItem {
    _id: string;
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    readTime: string;
    image: string;
    publishedAt: string;
}

interface NewsClientProps {
    initialData: {
        featuredNews: NewsItem | null;
        allNews: NewsItem[];
        totalCount: number;
    };
}

const NewsClient: React.FC<NewsClientProps> = ({ initialData }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [newsData, setNewsData] = useState({
        featuredNews: initialData.featuredNews,
        allNews: initialData.allNews,
        filteredNews: initialData.allNews
    });
    const [loading, setLoading] = useState(false);

    // Handle search
    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setNewsData(prev => ({
                ...prev,
                filteredNews: prev.allNews
            }));
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(`/api/news?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            setNewsData(prev => ({
                ...prev,
                filteredNews: data.allNews || []
            }));
        } catch (error) {
            console.error('Error searching news:', error);
        } finally {
            setIsSearching(false);
        }
    };

    // Load more articles
    const loadMore = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/news?start=${newsData.allNews.length}&end=${newsData.allNews.length + 6}`);
            const data = await response.json();

            setNewsData(prev => ({
                ...prev,
                allNews: [...prev.allNews, ...data.allNews],
                filteredNews: [...prev.allNews, ...data.allNews]
            }));
        } catch (error) {
            console.error('Error loading more news:', error);
        } finally {
            setLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    return (
        <main className="min-h-screen bg-black pt-24">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >
                        <motion.div variants={fadeInUp}>
                            <Badge variant="outline" className="mb-6 border-white/20 text-white/80">
                                News & Updates
                            </Badge>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl sm:text-6xl md:text-7xl font-medium text-white mb-6"
                        >
                            Latest from
                            <br />
                            <span className="text-white/60">our blog</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
                        >
                            Stay up to date with our latest research, product updates, and company news.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="relative max-w-md mx-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30" />
                            <Input
                                type="search"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-white/20"
                            />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/60 rounded-full animate-spin" />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Article */}
            {newsData.featuredNews && (
                <section className="py-12 border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="grid lg:grid-cols-2 gap-12 items-center"
                        >
                            <div>
                                <Badge className="mb-4 bg-white/10 text-white border-white/20">
                                    Featured
                                </Badge>
                                <h2 className="text-3xl font-medium text-white mb-4">{newsData.featuredNews.title}</h2>
                                <p className="text-white/60 mb-6">{newsData.featuredNews.excerpt}</p>
                                <div className="flex items-center gap-4 text-sm text-white/40 mb-6">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {newsData.featuredNews.date}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {newsData.featuredNews.readTime}
                                    </span>
                                </div>
                                <Link
                                    href={`/news/${newsData.featuredNews.slug}`}
                                    className="inline-flex items-center gap-2 text-white hover:text-white/70 transition-colors group"
                                >
                                    Read full article
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                                <Image
                                    src={newsData.featuredNews.image}
                                    alt={newsData.featuredNews.title}
                                    fill
                                    className="object-cover opacity-80"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* News Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {newsData.filteredNews.length > 0 ? (
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {newsData.filteredNews.map((news) => (
                                <motion.article
                                    key={news._id}
                                    variants={fadeInUp}
                                    whileHover={{ y: -5 }}
                                    className="group cursor-pointer"
                                >
                                    <Link href={`/news/${news.slug}`}>
                                        <div className="relative aspect-[16/9] mb-4 overflow-hidden rounded-xl bg-white/5 border border-white/10">
                                            <Image
                                                src={news.image}
                                                alt={news.title}
                                                fill
                                                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {news.date}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {news.readTime}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-medium text-white group-hover:text-white/80 transition-colors">
                                                {news.title}
                                            </h3>
                                            <p className="text-sm text-white/40 line-clamp-2">
                                                {news.excerpt}
                                            </p>
                                            <span className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors group/link">
                                                Read more
                                                <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.article>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-white/40">No articles found matching your search.</p>
                        </div>
                    )}

                    {/* Load More */}
                    {!searchQuery && newsData.filteredNews.length < newsData.totalCount && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mt-12"
                        >
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 rounded-full"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load more articles'}
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default NewsClient;