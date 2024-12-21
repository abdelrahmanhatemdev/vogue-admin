/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    // dynamicIO: true,
  }};

export default nextConfig;
