import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**"
      },
      {
        protocol: "https",
        hostname: "apicdn.sanity.io",
        pathname: "/images/**"
      }
    ]
  }
};

export default nextConfig;
