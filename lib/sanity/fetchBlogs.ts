import { client } from './client';
import { blogQueries } from './queries';
import { BlogPost } from '@/types/blog';

export async function fetchFeaturedBlogs(): Promise<{
  featuredPost: BlogPost | null;
  popularPosts: BlogPost[];
}> {
  try {
    const [featuredPost, popularPosts] = await Promise.all([
      client.fetch(blogQueries.getFeaturedPost),
      client.fetch(blogQueries.getPopularPosts),
    ]);

    return {
      featuredPost: featuredPost || null,
      popularPosts: popularPosts || [],
    };
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return {
      featuredPost: null,
      popularPosts: [],
    };
  }
}