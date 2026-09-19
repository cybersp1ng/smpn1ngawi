import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "admin.smpn1ngawi.sch.id",
      },
      {
        protocol: "https",
        hostname: "sp1ng.smpn1ngawi.sch.id",
      },
      {
        protocol: "http",
        hostname: "smpn1ngawi.local",
      },
    ],
  },
};

export default nextConfig;
