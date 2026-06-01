/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add empty turbopack config to silence Next 16 error while keeping compatibility
  turbopack: {},
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
