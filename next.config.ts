import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },
  // Ignore ESLint errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;