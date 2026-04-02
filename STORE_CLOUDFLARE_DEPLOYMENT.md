# Cloudflare Deployment Guide (Next.js)

This guide provides step-by-step instructions on how to deploy a Next.js application to Cloudflare Workers using the **OpenNext** adapter (`@opennextjs/cloudflare`). This is the modern, official way to deploy Next.js to Cloudflare.

## 1. Prerequisites

Before deploying, ensure your project does not use Vercel-specific packages, as they are incompatible with the Cloudflare Workers runtime.

Run this to remove them if they exist:
```bash
yarn remove @vercel/analytics @vercel/speed-insights
```
*(Also remove any `<Analytics />` or `<SpeedInsights />` imports from `src/app/layout.tsx`)*

## 2. Install Dependencies

You need to install the OpenNext adapter and Wrangler (Cloudflare's CLI tool).

```bash
yarn add @opennextjs/cloudflare@latest
yarn add -D wrangler@latest
```

## 3. Configuration Files

Create two configuration files in the root of your project:

### `wrangler.jsonc`
This tells Cloudflare how to run your built application.

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "YOUR_PROJECT_NAME", // Change this to your project name
  "compatibility_date": "2024-09-23", // Keep today's date or newer
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

### `open-next.config.ts`
This initialized OpenNext for the project.

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig();
```

## 4. Update package.json Scripts

Add the deployment scripts to your `package.json` under the `"scripts"` section.

> **Note:** If you are using Next.js 14, you **must** include the `--dangerouslyUseUnsupportedNextVersion` flag. OpenNext officially requires Next.js 15, but 14 works fine with this flag.

```json
"scripts": {
  // ... existing scripts
  "preview": "opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build --dangerouslyUseUnsupportedNextVersion && opennextjs-cloudflare deploy",
  "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
}
```
*(Remove the flag if the project is already on Next.js 15+)*

## 5. Ignore Build Files (.gitignore)

Add the OpenNext and Wrangler build output directories to your `.gitignore` so they don't get committed to GitHub:

```gitignore
# cloudflare / opennext
.open-next
.wrangler
cloudflare-env.d.ts
```

## 6. Fix Windows Casing Issues (Crucial)

If you are developing on **Windows**, TypeScript is case-insensitive, but the Cloudflare build environment (Linux) is **case-sensitive**. 

If your folders are lowercase (e.g., `src/context/`) but your imports are uppercase (`import ... from "@/Context/..."`), the `next build` **will fail** when running the deploy command.

**Fix:** Ensure all your imports exactly match the actual folder capitalization.

## 7. Deploy to Cloudflare

Run the deployment command:

```bash
yarn deploy
```

Wrangler will build the project using OpenNext, bundle it, and upload it to Cloudflare Workers. At the end, it will output a `.workers.dev` URL where your app is hosted.

## 8. Add Environment Variables

By default, `.env.local` files are ignored for security. You must manually add your production environment variables to Cloudflare:

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** -> Select your Project
3. Go to **Settings** -> **Variables & Secrets**
4. Add all required secrets (e.g., Database URLs, Auth Secrets, API Keys).
