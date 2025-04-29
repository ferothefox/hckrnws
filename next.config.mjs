/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/top/1",
        permanent: true,
      },
      {
        source: "/page/1",
        destination: "/top/1",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
