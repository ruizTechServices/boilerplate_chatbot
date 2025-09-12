import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable image optimization for Replit compatibility
  images: {
    unoptimized: true
  },
  // Configure allowed dev origins for Replit environment
  allowedDevOrigins: [
    ...(process.env.REPLIT_DEV_DOMAIN 
      ? [`https://${process.env.REPLIT_DEV_DOMAIN}`]
      : []
    ),
    "http://localhost:5000",
    "http://127.0.0.1:5000"
  ]
};

export default nextConfig;
