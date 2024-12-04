/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add any other Next.js configuration options here
  typescript: {
    // Set to true to ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Set to true to ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;