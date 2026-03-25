import { client } from './client';
import { latestNewsQueries } from './queries/latest-news';

export interface NewsAuthor {
    name: string;
    slug: string;
    image?: any;
    bio?: string;
}

export interface NewsPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    author?: NewsAuthor;
}

export async function fetchLatestNews(): Promise<{
    featuredNews: NewsPost | null;
    latestPosts: NewsPost[];
}> {
    try {
        const [featuredNews, latestPosts] = await Promise.all([
            client.fetch(latestNewsQueries.getFeaturedNews),
            client.fetch(latestNewsQueries.getLatestPosts),
        ]);

        // Transform featured news to match your interface
        const transformedFeatured = featuredNews ? {
            id: 1,
            title: featuredNews.title,
            slug: featuredNews.slug,
            excerpt: featuredNews.excerpt || '',
            category: featuredNews.category || 'Uncategorized',
            date: new Date(featuredNews.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            readTime: featuredNews.readTime || '5 min read',
            image: featuredNews.image || '/api/placeholder/600/400',
            author: featuredNews.author ? {
                name: featuredNews.author.name,
                avatar: featuredNews.author.image?.asset?.url || '/api/placeholder/40/40'
            } : undefined
        } : {
            id: 1,
            title: "OpenAI launches new reasoning model with breakthrough capabilities",
            excerpt: "The new model demonstrates advanced reasoning in mathematics, coding, and scientific problem-solving.",
            category: "Product Launch",
            date: "May 15, 2024",
            readTime: "5 min read",
            image: "https://unsplash.com/blog/content/images/2026/02/Greece--Blog-.jpg",
            author: {
                name: "Sarah Johnson",
                avatar: "/api/placeholder/40/40"
            }
        };

        // Transform latest posts to match your interface
        const transformedLatest = latestPosts.map((post: any, index: number) => ({
            id: index + 2,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            category: post.category || 'Uncategorized',
            date: new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            readTime: post.readTime || '5 min read',
            image: post.image || '/api/placeholder/600/400',
            author: post.author ? {
                name: post.author.name,
                avatar: post.author.image?.asset?.url || '/api/placeholder/40/40'
            } : undefined
        }));

        return {
            featuredNews: transformedFeatured,
            latestPosts: transformedLatest.length > 0 ? transformedLatest : [
                {
                    id: 2,
                    title: "How AI is transforming scientific discovery",
                    excerpt: "Researchers are using AI to accelerate breakthroughs in drug discovery.",
                    category: "Research",
                    date: "May 12, 2024",
                    readTime: "4 min read",
                    image: "https://unsplash.com/blog/content/images/2026/02/A-look-back-on-January--Blog-.jpg"
                },
                {
                    id: 3,
                    title: "Enterprise AI: Best practices for deployment",
                    excerpt: "Learn how leading companies are successfully deploying AI at scale.",
                    category: "Guide",
                    date: "May 10, 2024",
                    readTime: "7 min read",
                    image: "https://unsplash.com/blog/content/images/max/2560/1-gfkG5qircLtVi4Y4-iOSzQ.jpeg"
                },
                {
                    id: 4,
                    title: "Enterprise AI: Best practices for deployment",
                    excerpt: "Learn how leading companies are successfully deploying AI at scale.",
                    category: "Guide",
                    date: "May 10, 2024",
                    readTime: "7 min read",
                    image: "https://unsplash.com/blog/content/images/max/2560/1-gfkG5qircLtVi4Y4-iOSzQ.jpeg"
                }
                
            ]
        };
    } catch (error) {
        console.error('Error fetching latest news:', error);
        // Return fallback data
        return {
            featuredNews: {
                id: 1,
                title: "OpenAI launches new reasoning model with breakthrough capabilities",
                excerpt: "The new model demonstrates advanced reasoning in mathematics, coding, and scientific problem-solving.",
                category: "Product Launch",
                date: "May 15, 2024",
                readTime: "5 min read",
                image: "https://unsplash.com/blog/content/images/2026/02/Greece--Blog-.jpg",
                author: {
                    name: "Sarah Johnson",
                    avatar: "/api/placeholder/40/40"
                }
            },
            latestPosts: [
                {
                    id: 2,
                    slug: "how-ai-is-transforming-scientific-discovery",
                    title: "How AI is transforming scientific discovery",
                    excerpt: "Researchers are using AI to accelerate breakthroughs in drug discovery.",
                    category: "Research",
                    date: "May 12, 2024",
                    readTime: "4 min read",
                    image: "https://unsplash.com/blog/content/images/2026/02/A-look-back-on-January--Blog-.jpg"
                },
                {
                    id: 3,
                    title: "Enterprise AI: Best practices for deployment",
                    slug: "enterprise-ai-best-practices-for-deployment",
                    excerpt: "Learn how leading companies are successfully deploying AI at scale.",
                    category: "Guide",
                    date: "May 10, 2024",
                    readTime: "7 min read",
                    image: "https://unsplash.com/blog/content/images/max/2560/1-gfkG5qircLtVi4Y4-iOSzQ.jpeg"
                }
            ]
        };
    }
}