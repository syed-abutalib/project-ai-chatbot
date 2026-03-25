import { groq } from 'next-sanity';

export const blogQueries = {
  // Get featured post (only one)
  getFeaturedPost: groq`*[_type == "post" && isFeatured == true][0]{
    title,
    "slug": slug.current,
    publishedAt,
    "author": author->{
      name,
      "slug": slug.current,
      image,
      bio
    },
    mainImage,
    excerpt,
    isFeatured,
    isPopular,
    categories[]->{
      title,
      "slug": slug.current
    },
    "readingTime": round(length(pt::text(body)) / 200) + " min read"
  }`,

  // Get popular posts (excluding featured)
  getPopularPosts: groq`*[_type == "post" && isPopular == true && isFeatured != true] | order(publishedAt desc)[0...3]{
    title,
    "slug": slug.current,
    publishedAt,
    "author": author->{
      name,
      "slug": slug.current,
      image,
      bio
    },
    mainImage,
    excerpt,
    isFeatured,
    isPopular,
    categories[]->{
      title,
      "slug": slug.current
    },
    "readingTime": round(length(pt::text(body)) / 200) + " min read"
  }`,

  // Get recent posts (fallback)
  getRecentPosts: groq`*[_type == "post"] | order(publishedAt desc)[0...3]{
    title,
    "slug": slug.current,
    publishedAt,
    "author": author->{
      name,
      "slug": slug.current,
      image,
      bio
    },
    mainImage,
    excerpt,
    isFeatured,
    isPopular,
    categories[]->{
      title,
      "slug": slug.current
    },
    "readingTime": round(length(pt::text(body)) / 200) + " min read"
  }`
};
