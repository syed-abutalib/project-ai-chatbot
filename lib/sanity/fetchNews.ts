import { client } from './client';
import { 
  ALL_BLOGS_QUERY, 
  FEATURED_BLOG_QUERY, 
  PAGINATED_BLOGS_QUERY, 
  SEARCH_BLOGS_QUERY,
  TOTAL_BLOGS_COUNT_QUERY 
} from './queries/news';
import imageUrlBuilder from '@sanity/image-url';

// Initialize the image builder
const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export interface NewsItem {
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

export interface NewsPageData {
  featuredNews: NewsItem;
  allNews: NewsItem[];
  totalCount: number;
}

const FALLBACK_FEATURED = {
  _id: '1',
  id: 1,
  title: "Introducing our most capable AI model yet",
  excerpt: "Our latest breakthrough in AI reasoning achieves state-of-the-art results across mathematics, coding, and scientific problem-solving.",
  date: "May 15, 2024",
  readTime: "5 min read",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
  slug: "featured-post",
  publishedAt: "2024-05-15T00:00:00Z"
};

const FALLBACK_NEWS = [
  {
    _id: '2',
    id: 2,
    title: "New safety measures for responsible AI deployment",
    excerpt: "We're introducing enhanced safeguards and transparency measures to ensure our AI systems are used responsibly.",
    date: "May 12, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=600&h=400&fit=crop",
    slug: "safety-measures",
    publishedAt: "2024-05-12T00:00:00Z"
  },
  {
    _id: '3',
    id: 3,
    title: "Research breakthrough in neural network architecture",
    excerpt: "Our research team publishes new findings on more efficient and scalable neural network designs.",
    date: "May 10, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
    slug: "research-breakthrough",
    publishedAt: "2024-05-10T00:00:00Z"
  },
  {
    _id: '4',
    id: 4,
    title: "Expanding our global research partnerships",
    excerpt: "Announcing new collaborations with leading universities and research institutions worldwide.",
    date: "May 8, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    slug: "research-partnerships",
    publishedAt: "2024-05-08T00:00:00Z"
  },
  {
    _id: '5',
    id: 5,
    title: "Enterprise AI: New features for business customers",
    excerpt: "Introducing advanced analytics and integration tools for enterprise customers.",
    date: "May 5, 2024",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    slug: "enterprise-features",
    publishedAt: "2024-05-05T00:00:00Z"
  },
  {
    _id: '6',
    id: 6,
    title: "AI safety summit: Key takeaways",
    excerpt: "Our team shares insights from the recent global AI safety conference.",
    date: "May 3, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop",
    slug: "safety-summit",
    publishedAt: "2024-05-03T00:00:00Z"
  },
  {
    _id: '7',
    id: 7,
    title: "Democratizing AI access: New initiatives",
    excerpt: "Programs to make AI technology more accessible to students and researchers.",
    date: "May 1, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop",
    slug: "democratizing-ai",
    publishedAt: "2024-05-01T00:00:00Z"
  }
];

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
  if (!mainImage) return '/api/placeholder/600/400';
  
  try {
    // For Sanity image references
    if (mainImage.asset) {
      return urlFor(mainImage).width(600).height(400).url();
    }
    // For direct URLs
    if (typeof mainImage === 'string') return mainImage;
    // For other cases
    return '/api/placeholder/600/400';
  } catch (error) {
    console.error('Error generating image URL:', error);
    return '/api/placeholder/600/400';
  }
}

export async function fetchNewsData(
  start: number = 0,
  end: number = 6,
  searchTerm?: string
): Promise<NewsPageData> {
  try {
    console.log('Fetching news data with project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    
    // Fetch all blogs
    const allBlogs = await client.fetch(ALL_BLOGS_QUERY);
    console.log(`Fetched ${allBlogs?.length || 0} total blogs`);

    // Fetch featured news (latest post)
    console.log('Fetching featured news...');
    let featuredNews = await client.fetch(FEATURED_BLOG_QUERY);
    console.log('Featured news:', featuredNews);
    
    // Fetch paginated news
    console.log(`Fetching paginated news from ${start} to ${end}...`);
    let paginatedNews = searchTerm 
      ? await client.fetch(SEARCH_BLOGS_QUERY, { searchTerm: `*${searchTerm}*` })
      : await client.fetch(PAGINATED_BLOGS_QUERY, { start, end });
    
    console.log(`Fetched ${paginatedNews?.length || 0} news items`);

    // Fetch total count
    const totalCount = searchTerm 
      ? paginatedNews?.length || 0
      : await client.fetch(TOTAL_BLOGS_COUNT_QUERY);

    // Transform featured news
    const transformedFeatured = featuredNews ? {
      _id: featuredNews._id,
      id: 1,
      title: featuredNews.title,
      slug: featuredNews.slug,
      excerpt: featuredNews.excerpt || FALLBACK_FEATURED.excerpt,
      date: featuredNews.publishedAt ? formatDate(featuredNews.publishedAt) : FALLBACK_FEATURED.date,
      readTime: calculateReadTime(featuredNews.excerpt),
      image: getImageUrl(featuredNews.mainImage),
      publishedAt: featuredNews.publishedAt
    } : FALLBACK_FEATURED;

    // Transform paginated news
    const transformedNews = paginatedNews && paginatedNews.length > 0 
      ? paginatedNews.map((item: any, index: number) => ({
          _id: item._id,
          id: index + 2,
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt || '',
          date: item.publishedAt ? formatDate(item.publishedAt) : 'Unknown date',
          readTime: calculateReadTime(item.excerpt),
          image: getImageUrl(item.mainImage),
          publishedAt: item.publishedAt
        }))
      : FALLBACK_NEWS;

    return {
      featuredNews: transformedFeatured,
      allNews: transformedNews,
      totalCount
    };
  } catch (error) {
    console.error('Error fetching news data:', error);
    // Return fallback data
    return {
      featuredNews: FALLBACK_FEATURED,
      allNews: FALLBACK_NEWS,
      totalCount: FALLBACK_NEWS.length
    };
  }
}

// For client-side search/pagination
export async function searchNews(searchTerm: string): Promise<NewsItem[]> {
  try {
    console.log('Searching news with term:', searchTerm);
    const results = await client.fetch(SEARCH_BLOGS_QUERY, { 
      searchTerm: `*${searchTerm}*` 
    });
    
    console.log(`Search returned ${results?.length || 0} results`);
    
    return results && results.length > 0 ? results.map((item: any, index: number) => ({
      _id: item._id,
      id: index + 1,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      date: item.publishedAt ? formatDate(item.publishedAt) : 'Unknown date',
      readTime: calculateReadTime(item.excerpt),
      image: getImageUrl(item.mainImage),
      publishedAt: item.publishedAt
    })) : [];
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
}