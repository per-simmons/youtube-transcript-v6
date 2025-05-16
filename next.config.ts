import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure Edge Runtime compatibility for API routes
  experimental: {
    // Ensure compatibility with youtube-transcript-plus in edge runtime
    serverComponentsExternalPackages: ["youtube-transcript-plus"],
  },
};

export default nextConfig;
