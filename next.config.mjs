/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable React Strict Mode
  images: {
    domains: ["example.com", "images.unsplash.com","firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
