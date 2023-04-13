/** @type {import('next').NextConfig} */

const cacheHeaders = [
  {
    key: "Cache-Control",
    value: "max-age=3600, s-maxage=3600",
  },
];

const nextConfig = {
  reactStrictMode: true,
  headers: cacheHeaders,
};

module.exports = nextConfig;
