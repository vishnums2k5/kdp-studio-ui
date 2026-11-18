import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // react-konva SSR recipe: keep konva's node build from pulling node-canvas
    // (see docs/stack-decision.md risks)
    config.externals = [...config.externals, { canvas: "canvas", jsdom: "jsdom" }];
    return config;
  },
};

export default nextConfig;
