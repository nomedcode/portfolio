# Portfolio

Personal portfolio of Fa'iq Haidar Prasetya, a Computer Science (Cloud Technology) student at BINUS University. It presents projects, skills, certificates, awards, education and contact details in a single, fast, accessible page.

## Tech stack

- Next.js 16 (static export), React 19, TypeScript
- Tailwind CSS v4
- Motion (framer-motion) for animation, with reduced-motion support
- Vitest and Testing Library for tests
- Deployed on Vercel

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the static site |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite |
| `npm run check:bundle` | Fail if first-load JavaScript exceeds the size budget (run after a build) |

## Editing content

Page copy, skills, education and links live in `src/lib/content.ts`.

## Branches

- `main`: production, deployed to Vercel
- `dev`: ongoing work
