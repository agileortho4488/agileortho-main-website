/** @type {import('next').NextConfig} */
// Fully static site. Redirects live in vercel.json (static export ignores next.config redirects).
module.exports = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  reactStrictMode: true,
};
