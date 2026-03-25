// app/api/news/[slug]/route.ts
import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity/client';
import { GET_POST_BY_SLUG_QUERY, GET_RELATED_POSTS_QUERY } from '@/lib/sanity/queries/news';
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

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

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Fetch post and related posts in parallel
    const [post, relatedPosts] = await Promise.all([
      client.fetch(GET_POST_BY_SLUG_QUERY, { slug }),
      client.fetch(GET_RELATED_POSTS_QUERY, { slug })
    ]);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Transform post data
    const transformedPost = {
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.body,
      date: formatDate(post.publishedAt),
      readTime: post.estimatedReadingTime || '5 min read',
      image: getImageUrl(post.mainImage, 1200, 800),
      author: post.author ? {
        name: post.author.name,
        image: post.author.image ? getImageUrl(post.author.image, 100, 100) : null
      } : null,
      publishedAt: post.publishedAt
    };

    // Transform related posts
    const transformedRelated = relatedPosts.map((post: any, index: number) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      date: formatDate(post.publishedAt),
      readTime: post.estimatedReadingTime || '5 min read',
      image: getImageUrl(post.mainImage, 600, 400)
    }));

    return NextResponse.json({
      post: transformedPost,
      relatedPosts: transformedRelated
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}