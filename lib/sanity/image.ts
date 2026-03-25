// lib/sanity/image.ts
import ImageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = ImageUrlBuilder(client);

export function urlForImage(source: any) {
  return builder.image(source);
}