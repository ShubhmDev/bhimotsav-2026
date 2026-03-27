import type { NextConfig } from "next";

const allowedOrigins = ["localhost:3000", "127.0.0.1:3000", "*.app.github.dev"];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.vogue.in',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'pixabay.com',
      },
      {
        protocol: 'https',
        hostname: '*.pixabay.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.unsplash.com https://plus.unsplash.com https://assets.vogue.in https://raw.githubusercontent.com; img-src 'self' data: https://*.unsplash.com https://plus.unsplash.com https://assets.vogue.in https://raw.githubusercontent.com https://*.pixabay.com https://pixabay.com https://picsum.photos https://fastly.picsum.photos;",
          },
        ],
      },
    ]
  },
};

export default nextConfig;
