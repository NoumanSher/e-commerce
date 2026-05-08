/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
  images: {
    // ⚠️ Cloudflare Workers (edge runtime) does NOT support Next.js image
    // optimization server (/_next/image). Setting unoptimized:true passes the
    // original Cloudinary URL directly to the browser. Images are already
    // optimised/CDN-served by Cloudinary, so there is no quality loss.
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
        // Static assets: cache aggressively (Next.js busts by hash)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Optimized images: cache for 24 hours
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=3600",
          },
        ],
      },
      {
        // HTML pages: revalidate on each visit but serve stale while revalidating
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, stale-while-revalidate=300",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
