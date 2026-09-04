/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aqua-seal-233446.hostingersite.com",
      },
    ],
  },
};

module.exports = nextConfig;
