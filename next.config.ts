import type { NextConfig } from "next";

const allowedOrigins = ["localhost:3000", "127.0.0.1:3000", "*.app.github.dev"];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
