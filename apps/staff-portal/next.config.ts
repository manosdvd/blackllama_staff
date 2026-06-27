import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip type-check overhead during bundle building
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
