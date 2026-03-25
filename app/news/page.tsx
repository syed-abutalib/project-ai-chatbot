// app/news/page.tsx (Server Component)
import { Suspense } from "react";
import NewsClient from "@/components/pages/NewsPage/NewsPage";
import { client } from "@/lib/sanity/client";
import {
  FEATURED_BLOG_QUERY,
  PAGINATED_BLOGS_QUERY,
  TOTAL_BLOGS_COUNT_QUERY,
} from "@/lib/sanity/queries/news";
import imageUrlBuilder from "@sanity/image-url";
import Layout from "@/components/common/Layout";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "EduDev News & Updates",
  description:
    "Stay updated with the latest news, announcements, and AI developments from EduDev.",
  keywords: [
    "EduDev news",
    "AI updates",
    "announcements",
    "AI education",
    "press releases",
  ],
  openGraph: {
    title: "EduDev News & Updates",
    description:
      "Stay updated with the latest news, announcements, and AI developments from EduDev.",
    url: "/news",
    siteName: "EduDev",
    images: [
      {
        url: "/logo.png", // <-- your logo
        width: 512,
        height: 512,
        alt: "EduDev Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduDev News & Updates",
    description:
      "Follow EduDev for the latest news, announcements, and AI developments.",
    images: ["/logo.png"], // logo
  },
};
// Loading component
function NewsLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white/60">Loading...</div>
    </div>
  );
}

// Initialize image builder
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calculateReadTime(excerpt?: string): string {
  const wordCount = (excerpt?.length || 200) / 5;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}

function getImageUrl(mainImage: any): string {
  if (!mainImage)
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop";
  try {
    if (mainImage.asset) return urlFor(mainImage).width(600).height(400).url();
    if (typeof mainImage === "string") return mainImage;
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop";
  } catch {
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop";
  }
}

export default async function NewsPage() {
  // Fetch initial data on the server
  const [featuredNews, paginatedNews, totalCount] = await Promise.all([
    client.fetch(FEATURED_BLOG_QUERY),
    client.fetch(PAGINATED_BLOGS_QUERY, { start: 0, end: 6 }),
    client.fetch(TOTAL_BLOGS_COUNT_QUERY),
  ]);

  // Transform data on the server
  const initialData = {
    featuredNews: featuredNews
      ? {
          _id: featuredNews._id,
          id: 1,
          title: featuredNews.title,
          slug: featuredNews.slug,
          excerpt: featuredNews.excerpt || "",
          date: featuredNews.publishedAt
            ? formatDate(featuredNews.publishedAt)
            : "",
          readTime: calculateReadTime(featuredNews.excerpt),
          image: getImageUrl(featuredNews.mainImage),
          publishedAt: featuredNews.publishedAt,
        }
      : null,

    allNews:
      paginatedNews?.length > 0
        ? paginatedNews.map((item: any, index: number) => ({
            _id: item._id,
            id: index + 2,
            title: item.title,
            slug: item.slug,
            excerpt: item.excerpt || "",
            date: item.publishedAt ? formatDate(item.publishedAt) : "",
            readTime: calculateReadTime(item.excerpt),
            image: getImageUrl(item.mainImage),
            publishedAt: item.publishedAt,
          }))
        : [],

    totalCount,
  };

  return (
    <Layout>
      <Suspense fallback={<NewsLoading />}>
        <NewsClient initialData={initialData} />
      </Suspense>
    </Layout>
  );
}
