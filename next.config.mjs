/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Disables Next.js's built-in image optimization, which can be useful
    // in certain deployment environments.
    unoptimized: true,
  },
};

export default nextConfig;
