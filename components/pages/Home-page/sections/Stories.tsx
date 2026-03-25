// app/page.tsx or app/blog/page.tsx
import FeaturedBlogSection from '@/components/pages/Home-page/sections/featured-blog-section';
import { fetchLatestNews } from "@/lib/sanity/fetchLatestNews"

export default async function BlogSection() {
    const { featuredNews, latestPosts } = await fetchLatestNews();

    return (
        <main>
            {/* Other sections */}
            <FeaturedBlogSection
                featuredPost={featuredNews}
                latestPosts={latestPosts}
            />
            {/* Other sections */}
        </main>
    );
}