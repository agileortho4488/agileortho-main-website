/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow importing JSX files without extension changes
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Proxy all /api/* requests to the FastAPI backend
  async rewrites() {
    return [
      {
        source: '/api/:path((?!enquiry|products).*)',
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
        hostname: 'agilehealthcare.in',
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

  // Webpack fallback for node modules in client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
