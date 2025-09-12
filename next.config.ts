import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Replit compatibility
  images: {
    unoptimized: true
  },
  // Configure for development server in Replit
  experimental: {
    serverActions: {
      allowedOrigins: ["*"]
    }
  }
};

export default nextConfig;
