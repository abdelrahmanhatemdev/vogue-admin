/** @type {import('next').NextConfig} */
const securityHeaders = [
  // {
  //   key: "Content-Security-Policy",
  //   value: `
  //     default-src 'self'; 
  //     script-src 'self' https://trusted.cdn.com; 
  //     object-src 'none'; 
  //     upgrade-insecure-requests; 
  //   `.replace(/\s{2,}/g, " ").trim(),
  // },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=()",
  },
];

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
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
