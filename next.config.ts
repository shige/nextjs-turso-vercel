import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@tursodatabase/database", "@tursodatabase/sync"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
