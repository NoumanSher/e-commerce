# Copilot Instructions — E-commerce Next.js App

Purpose: Help AI coding agents quickly become productive in this repository by describing the architecture, developer workflows, conventions, and concrete examples found in the codebase.

Big picture
- Framework: Next.js 14 using the App Router (see `src/app/layout.tsx` and `src/app/page.tsx`).
- Data fetching: `@tanstack/react-query` is used extensively. Server components prefetch with a QueryClient, then dehydrate/hydrate on the client (see `src/app/page.tsx`).
- API layer: HTTP requests use `axios` and centralized `BASE_URL` from `src/constants.ts`. Services live in `src/services/*` (e.g. `productsService.ts`, `productService.ts`, `categoryService.ts`).
- State & context: React Query provider is implemented as a client provider in `src/Context/react-query-provider.tsx`. Additional context wrappers exist (e.g. `StoreTypeProviderWrapper`).

Key developer workflows
- Run locally: `npm run dev` (uses `next dev`).
- Build: `npm run build`, Start production server: `npm run start`.
- Lint: `npm run lint` (Next.js ESLint config).
- Fonts/assets: global styles in `src/app/globals.css` and Tailwind configuration in `tailwind.config.ts`.

Project-specific conventions
- File layout: feature/component folders with `index.tsx` exports (see `src/components/*`).
- Services return typed responses (TypeScript interfaces in the same service or a `dto` file). Follow the existing pattern: use `axios`, catch errors and throw an `ApiError`-like object (see `src/services/productsService.ts`).
- DTOs & queries: Components that fetch data often have `dto`, `query`, and `api` subfiles (e.g. `components/productDetail/productDetailDto.ts`, `productDetailQuery.ts`). Keep that separation.
- React Query usage:
  - Server-side prefetch: create a QueryClient in the server component, call `ensureQueryData` or `fetchQuery`, then `dehydrate` and wrap rendered output in `<HydrationBoundary state={dehydrate(queryClient)}>`.
  - Client provider: use `src/Context/react-query-provider.tsx` which exports a client-only `QueryClientProvider` wrapper.
- Client-only components: use `dynamic(..., { ssr: false })` or place `"use client"` in component files. Example: `shoppingCartModal` is imported client-side only.
- Styling: Tailwind + `cn()` utility in `src/lib/utils.ts` (wraps `clsx` + `tailwind-merge`). Use `formatPrice` utility there too.

Integration & external dependencies
- Auth: `next-auth` used (see `components/Login/*` for query/service patterns).
- Analytics: `@vercel/analytics` and `@vercel/speed-insights` are wired in `layout.tsx`. GA measurement ID read from `process.env.GA_MEASUREMENT_ID`.
- Remote images: allowed hosts configured in `next.config.mjs` under `images.remotePatterns` (update when adding new image hosts).
- File uploads/images may use `res.cloudinary.com` and other external storage (see `next.config.mjs` and `public/`).

Guidance & examples (copyable snippets)
- Add a new API service (pattern):
  - Create `src/services/myThingService.ts`.
  - Use `import axios from 'axios'` and `BASE_URL` from `src/constants.ts`.
  - Return typed interfaces and throw an object with `{ message, statusCode, response }` on failure (see `productsService.ts`).

- Prefetch on server + hydrate on client (pattern used in `src/app/page.tsx`):
  - `const qc = new QueryClient()`
  - `await qc.ensureQueryData({ queryKey: ['key'], queryFn: fetchFn })`
  - Wrap UI with `<HydrationBoundary state={dehydrate(qc)}>` to hydrate on client.

- Client-only modal / dynamic import pattern:
  - `const Modal = dynamic(() => import('...'), { ssr: false })` for components relying on browser APIs.

What NOT to change without checking the app
- The React Query provider and hydration pattern across server/client — changing these may break SSR/data consistency.
- `next.config.mjs` image remote hosts — missing hosts will break remote image rendering.

Where to look for examples
- Root layout & analytics: `src/app/layout.tsx`
- Landing page / SSR-prefetch: `src/app/page.tsx`
- Query provider: `src/Context/react-query-provider.tsx`
- Services: `src/services/*.ts` (e.g. `productsService.ts`)
- Utilities: `src/lib/utils.ts`
- Components with client-only behavior: look for `dynamic(..., { ssr: false })` and `"use client"` markers (search repo for `ssr: false` and `use client`).

If anything here is unclear or you want additional examples (e.g. a template for new services or a sample server-prefetch), tell me which area to expand and I will iterate.
