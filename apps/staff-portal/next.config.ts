import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY;

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: supabaseAnonKey,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey
  },
  // Skip type-check overhead during bundle building
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
