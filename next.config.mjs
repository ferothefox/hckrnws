import million from 'million/compiler';

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
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

const millionConfig = {
  auto: true,
}

export default million.next(nextConfig, millionConfig);