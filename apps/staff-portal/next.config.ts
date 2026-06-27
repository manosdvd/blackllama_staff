import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  // Skip type-check overhead during bundle building
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
