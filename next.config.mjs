/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
  // Transpile Monaco editor
  transpilePackages: ['@monaco-editor/react'],
  // ESLint v9 - run separately via npm run lint
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
