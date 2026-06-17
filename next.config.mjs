/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "localhost",
    "sandbox.localhost",
    "shoes.lvh.me",
    "outfiters.pakshipper.local",
    "watches.pakshipper.local",
    "*.localhost",
    "*.lvh.me",
    "*.pakshipper.local",
  ],
  // Skip Next.js's built-in TypeScript checking during `next build`.
  // We already validate separately with `npx tsc --noEmit` (which passes cleanly).
  // Next.js's own TS checker was hanging before compilation could start.
  typescript: {
    ignoreBuildErrors: true,
  },
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
      {
        protocol: "https",
        hostname: "pakshipper-backend-production.up.railway.app",
      },
      // Placeholder images used during development / tenant seeding
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // via.placeholder.com fallback
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      // Picsum Photos (commonly used in seeds/demos)
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "http",
        hostname: "sandbox.localhost",
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
