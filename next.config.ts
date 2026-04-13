import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/page/1",
        destination: "/top/1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
