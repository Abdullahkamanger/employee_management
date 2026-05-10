import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 'remotePatterns' is the modern, more secure way to do this
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  /* You can add other config options here later */
};

export default nextConfig;
