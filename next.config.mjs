/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // 🚫 tắt Turbopack, buộc Next.js dùng Webpack
  },
};

export default nextConfig;
