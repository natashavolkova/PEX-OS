/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Allow production builds to complete even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow production builds to complete even with lint errors
    ignoreDuringBuilds: true,
  },
  experimental: {
    typedRoutes: true,
  },
}

module.exports = nextConfig
