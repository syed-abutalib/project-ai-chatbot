// app/news/[slug]/page.tsx (Enhanced with more meta fields)
import { client } from '@/lib/sanity/client';
import { GET_POST_BY_SLUG_QUERY, GET_RELATED_POSTS_QUERY } from '@/lib/sanity/queries/news';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import BlogDetailClient from '@/components/pages/Detail/BlogDetailClient';
import imageUrlBuilder from '@sanity/image-url';
import Layout from '@/components/common/Layout';
import { Metadata } from 'next';

const builder = imageUrlBuilder(client);

function urlFor(source: any) { return builder.image(source); }

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

function getImageUrl(mainImage: any, width: number = 1200, height?: number): string {
    if (!mainImage) return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop';
    try {
        if (mainImage.asset) {
            let builder = urlFor(mainImage).width(width);
            if (height) builder = builder.height(height);
            return builder.url();
        }
        if (typeof mainImage === 'string') return mainImage;
        return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop';
    } catch {
        return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop';
    }
}

function stripHtml(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
}

// Generate metadata for the page
export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const slug = params.slug;

    try {
        // Fetch the post data for metadata
        const post = await client.fetch(GET_POST_BY_SLUG_QUERY, { slug });

        if (!post) {
            return {
                title: 'Post Not Found | EduDev',
                description: 'The requested blog post could not be found.',
                robots: 'noindex, nofollow',
            };
        }

        const imageUrl = getImageUrl(post.mainImage, 1200, 630);
        const description = post.seoDescription || post.excerpt || stripHtml(post.content) || 'Read our latest blog post about AI, development, and technology.';
        const title = post.seoTitle ? `${post.seoTitle} | EduDev` : `${post.title} | EduDev Blog`;
        const publishedTime = post.publishedAt;
        const modifiedTime = post.updatedAt || post.publishedAt;
        
        // Get category from post
        const category = post.categories?.[0]?.title || 'Blog';

        return {
            title: title,
            description: description,
            keywords: post.keywords || post.tags || ['AI', 'Machine Learning', 'Development', 'Technology', 'EduDev'],
            authors: post.author ? [{ name: post.author.name, url: post.author.url }] : [{ name: 'EduDev Team' }],
            category: category,
            openGraph: {
                title: title,
                description: description,
                type: 'article',
                publishedTime: publishedTime,
                modifiedTime: modifiedTime,
                authors: post.author ? [post.author.name] : ['EduDev Team'],
                tags: post.keywords || post.tags,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                        type: 'image/jpeg',
                    },
                ],
                url: `https://yourdomain.com/news/${slug}`,
                siteName: 'EduDev',
                locale: 'en_US',
            },
            twitter: {
                card: 'summary_large_image',
                title: title,
                description: description,
                images: [imageUrl],
                creator: post.author?.twitter || '@edudev',
                site: '@edudev',
            },
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            alternates: {
                canonical: `https://yourdomain.com/news/${slug}`,
            },
            metadataBase: new URL('https://yourdomain.com'),
            verification: {
                google: 'your-google-verification-code',
            },
            other: {
                'article:section': category,
                'article:published_time': publishedTime,
                'article:modified_time': modifiedTime,
                'article:author': post.author?.name || 'EduDev Team',
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post | EduDev',
            description: 'Read our latest blog posts about AI, development, and technology.',
        };
    }
}

// Loading component
function BlogDetailLoading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
            </div>
        </div>
    );
}

// Fix: Await the params promise
export default async function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
    // Await the params
    const params = await props.params;
    const slug = params.slug;

    // Fetch data on the server with the slug parameter
    const [post, relatedPosts] = await Promise.all([
        client.fetch(GET_POST_BY_SLUG_QUERY, { slug }),
        client.fetch(GET_RELATED_POSTS_QUERY, { slug })
    ]);

    if (!post) {
        notFound();
    }
    
    console.log('Fetched post data:', post);
    
    // Transform data
    const transformedPost = {
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        date: formatDate(post.publishedAt),
        readTime: post.estimatedReadingTime || '5 min read',
        image: getImageUrl(post.mainImage, 1200, 800),
        author: post.author ? {
            name: post.author.name,
            image: post.author.image ? getImageUrl(post.author.image, 100, 100) : null
        } : null,
        publishedAt: post.publishedAt
    };

    const transformedRelated = relatedPosts.map((post: any, index: number) => ({
        _id: post._id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        date: formatDate(post.publishedAt),
        readTime: post.estimatedReadingTime || '5 min read',
        image: getImageUrl(post.mainImage, 600, 400)
    }));

    // Enhanced JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: transformedPost.title,
        description: transformedPost.excerpt,
        image: transformedPost.image,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author?.name || 'EduDev Team',
            url: post.author?.url || 'https://yourdomain.com/about',
            sameAs: post.author?.socialLinks || [],
        },
        publisher: {
            '@type': 'Organization',
            name: 'EduDev',
            logo: {
                '@type': 'ImageObject',
                url: 'https://yourdomain.com/logo.png',
            },
            url: 'https://yourdomain.com',
            sameAs: [
                'https://twitter.com/edudev',
                'https://github.com/edudev',
                'https://linkedin.com/company/edudev',
            ],
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://yourdomain.com/news/${slug}`,
        },
        keywords: post.keywords?.join(', ') || 'AI, Machine Learning, Development',
        articleSection: post.categories?.[0]?.title || 'Blog',
        inLanguage: 'en-US',
        timeRequired: post.estimatedReadingTime || 'PT5M',
    };

    // Add breadcrumb structured data
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://yourdomain.com',
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'News',
                item: 'https://yourdomain.com/news',
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: transformedPost.title,
                item: `https://yourdomain.com/news/${slug}`,
            },
        ],
    };

    return (
        <>
            {/* Add JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />
            <Layout>
                <Suspense fallback={<BlogDetailLoading />}>
                    <BlogDetailClient post={transformedPost} relatedPosts={transformedRelated} />
                </Suspense>
            </Layout>
        </>
    );
}