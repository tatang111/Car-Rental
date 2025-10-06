import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "ik.imagekit.io", "lh3.googleusercontent.com"]
  },
  output: "standalone"
};

export default nextConfig;
