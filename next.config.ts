import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    // Disable ESLint during build - we'll fix config separately
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
