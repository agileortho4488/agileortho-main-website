/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing JSX files without extension changes
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Proxy all /api/* requests to the FastAPI backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/api/:path*`,
      },
    ];
  },

  // Image optimization - allow Cloudflare CDN and storage domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'agileortho.in',
      },
      {
        protocol: 'https',
        hostname: 'cdn.agileortho.in',
      },
    ],
  },

  // Supress hydration warnings from browser extensions
  reactStrictMode: true,
};

module.exports = nextConfig;
