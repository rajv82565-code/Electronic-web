import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'refresh-exemption-already-conventions.trycloudflare.com',
    '*.trycloudflare.com',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
