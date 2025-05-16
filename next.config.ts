import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Update configuration for Node.js compatibility
  experimental: {
    // Use the correct property name for external packages
    serverComponentsExternalPackages: ["youtube-transcript-plus"],
  },
  // Webpack configuration to handle Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client
      config.resolve.fallback = {
        fs: false,
        path: false,
        'fs/promises': false
      };
    }
    return config;
  }
};

export default nextConfig;
