export interface Author {
  name: string;
  slug: { current: string };
  image?: any;
  bio?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  author: Author;
  mainImage?: any;
  excerpt?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  categories?: string[];
  readingTime?: string;
  likes?: number;
}

export interface Category {
  title: string;
  slug: { current: string };
}