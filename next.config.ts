import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Replit compatibility
  images: {
    unoptimized: true
  }
};

export default nextConfig;
