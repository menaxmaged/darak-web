import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "lvn-api.codexeg.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    ],
  },
};

export default nextConfig;
