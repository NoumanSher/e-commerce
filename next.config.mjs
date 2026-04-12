/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Disable React Strict Mode
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "e-commerce-backend-seven-xi.vercel.app",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "pakshipper-backend.vercel.app",
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
