/**
 * Application-level environment configuration.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to override for local development.
 */
export const BASE_URL_LIVE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://pakshipper-backend.vercel.app/api";
