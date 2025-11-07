import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/sdk", "@repo/ui"],
};

export default nextConfig;
