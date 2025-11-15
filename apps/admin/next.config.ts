import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@repo/sdk", "@repo/shared"],
};

export default nextConfig;
