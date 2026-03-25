// lib/sanity/queries/news.ts
import { groq } from "next-sanity";

export const ALL_BLOGS_QUERY = groq`
*[_type == "post"]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage
} | order(publishedAt desc)
`;

// For pagination
export const PAGINATED_BLOGS_QUERY = groq`
*[_type == "post"] | order(publishedAt desc)[$start...$end]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage
}
`;

// For search
export const SEARCH_BLOGS_QUERY = groq`
*[_type == "post" && (title match $searchTerm || excerpt match $searchTerm)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage
}
`;

// For featured (latest) post
export const FEATURED_BLOG_QUERY = groq`
*[_type == "post"] | order(publishedAt desc)[0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage
}
`;

export const GET_POST_BY_SLUG_QUERY = groq`
*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage,
  content,
  "author": author->{
    name,
    "slug": slug.current,
    image
  },
  "estimatedReadingTime": round(length(pt::text(body)) / 200) + " min read"
}
`;

// Get related posts (excluding current)
export const GET_RELATED_POSTS_QUERY = groq`
*[_type == "post" && slug.current != $slug] | order(publishedAt desc)[0...3]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  mainImage,
  "estimatedReadingTime": round(length(pt::text(body)) / 200) + " min read"
}
`;

// Get total count for pagination
export const TOTAL_BLOGS_COUNT_QUERY = groq`count(*[_type == "post"])`;
