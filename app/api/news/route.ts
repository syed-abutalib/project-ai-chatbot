// app/api/news/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { 
  ALL_BLOGS_QUERY, 
  FEATURED_BLOG_QUERY, 
  PAGINATED_BLOGS_QUERY, 
  SEARCH_BLOGS_QUERY,
  TOTAL_BLOGS_COUNT_QUERY 
} from '@/lib/sanity/queries/news';
import imageUrlBuilder from '@sanity/image-url';

// Initialize the image builder
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function calculateReadTime(excerpt?: string): string {
  const wordCount = (excerpt?.length || 200) / 5;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}

function getImageUrl(mainImage: any): string {
  if (!mainImage) return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop';
  
  try {
    if (mainImage.asset) {
      return urlFor(mainImage).width(600).height(400).url();
    }
    if (typeof mainImage === 'string') return mainImage;
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop';
  } catch (error) {
    console.error('Error generating image URL:', error);
    return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop';
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get('start') || '0');
    const end = parseInt(searchParams.get('end') || '6');
    const searchTerm = searchParams.get('search');

    console.log('Fetching news data from Sanity...');

    // Fetch all blogs
    const allBlogs = await client.fetch(ALL_BLOGS_QUERY);
    
    // Fetch featured news
    const featuredNews = await client.fetch(FEATURED_BLOG_QUERY);
    
    // Fetch paginated news
    const paginatedNews = searchTerm 
      ? await client.fetch(SEARCH_BLOGS_QUERY, { searchTerm: `*${searchTerm}*` })
      : await client.fetch(PAGINATED_BLOGS_QUERY, { start, end });
    
    // Fetch total count
    const totalCount = searchTerm 
      ? paginatedNews?.length || 0
      : await client.fetch(TOTAL_BLOGS_COUNT_QUERY);

    // Transform data
    const transformedData = {
      featuredNews: featuredNews ? {
        _id: featuredNews._id,
        id: 1,
        title: featuredNews.title,
        slug: featuredNews.slug,
        excerpt: featuredNews.excerpt || '',
        date: featuredNews.publishedAt ? formatDate(featuredNews.publishedAt) : '',
        readTime: calculateReadTime(featuredNews.excerpt),
        image: getImageUrl(featuredNews.mainImage),
        publishedAt: featuredNews.publishedAt
      } : null,

      allNews: paginatedNews?.length > 0 ? paginatedNews.map((item: any, index: number) => ({
        _id: item._id,
        id: index + 2,
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt || '',
        date: item.publishedAt ? formatDate(item.publishedAt) : '',
        readTime: calculateReadTime(item.excerpt),
        image: getImageUrl(item.mainImage),
        publishedAt: item.publishedAt
      })) : [],

      totalCount
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error in news API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}