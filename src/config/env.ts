import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_WHATSAPP_PHONE: z.string().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_WHATSAPP_PHONE: process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    ..._env.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}\n`)
  );
  throw new Error('Invalid environment variables');
}

export const env = _env.data;

/**
 * Application-level environment configuration.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local to override for local development.
 */
export const BASE_URL_LIVE =
  env.NEXT_PUBLIC_API_BASE_URL ?? "https://pakshipper-backend.vercel.app/api";

