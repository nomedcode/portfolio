# Portfolio

Personal portfolio of me, a Computer Science (Cloud Technology Stream) student at BINUS University. 

## Tech stack

- Next.js 16 (static export), React 19, TypeScript
- Tailwind CSS v4
- Motion (framer-motion) for animation, with reduced-motion support
- Vitest and Testing Library for tests
- Deployed on Vercel

## Local development

Node 22 (see `.nvmrc`); the package requires >= 20.9.0.

```bash
npm ci
npm run dev          # http://localhost:3000
```

## Checks

```bash
npm run lint
npm run typecheck
npm test             # unit tests
npm run build        # static export to out/
npm run check:bundle # first-load JS budget (run after build)
npm run test:e2e     # Playwright, chromium + firefox + webkit
```

## Production build and preview

The site is a static export; `next start` does not work with it.

```bash
npm run build
npm start            # serves out/ on http://localhost:3000
```

## Deploy

- Vercel builds from `main`; `dev` is the integration branch.
- Build command `npm run build`, output directory `out/`.
- Security headers and asset caching live in `vercel.json`, because `output: "export"` cannot set them from `next.config.ts`.
- Rollback: redeploy the previous deployment from the Vercel dashboard (Deployments → Promote).

## Branches

- `main`: production, deployed to Vercel
- `dev`: ongoing work
