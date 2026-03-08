import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from private IPs (needed for local Drupal development)
    dangerouslyAllowSVG: false,
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        // Local Drupal instance (development)
        protocol: "http",
        hostname: "localhost",
        port: "8888",
        pathname: "/sites/default/files/**",
      },
      {
        // Manus sandbox Drupal instance
        protocol: "https",
        hostname: "8888-isdhhzdmj1aqxs0a2pp57-20a9ef4f.us2.manus.computer",
        pathname: "/sites/default/files/**",
      },
      {
        // Production Drupal (wildcard for any HTTPS domain)
        protocol: "https",
        hostname: "**",
        pathname: "/sites/default/files/**",
      },
    ],
  },
};

export default nextConfig;
