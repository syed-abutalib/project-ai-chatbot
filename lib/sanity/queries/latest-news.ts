import { groq } from 'next-sanity';

export const latestNewsQueries = {
  // Get featured news post (latest by date)
  getFeaturedNews: groq`*[_type == "post"] | order(publishedAt desc)[0]{
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
    categories[]->{
      title,
      "slug": slug.current
    },
    "category": categories[0]->title,
    "date": publishedAt,
    "readTime": round(length(pt::text(body)) / 200) + " min read",
    "image": mainImage.asset->url
  }`,

  // Get latest posts (excluding the featured one)
  getLatestPosts: groq`*[_type == "post"] | order(publishedAt desc)[1...3]{
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
    categories[]->{
      title,
      "slug": slug.current
    },
    "category": categories[0]->title,
    "date": publishedAt,
    "readTime": round(length(pt::text(body)) / 200) + " min read",
    "image": mainImage.asset->url
  }`
};