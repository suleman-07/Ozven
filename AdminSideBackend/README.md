# AdminSideBackend

Express + Prisma admin API. Runs locally via Node and on Vercel as a serverless function.

## Local

```bash
npm install
npm run dev
```

Server: `http://localhost:5000` — health: `GET /health`

## Vercel

- Entry: `api/index.js` (exports Express app; no `listen`)
- Build: `npm run vercel-build` (`prisma generate` + `prisma migrate deploy`)
- Root Directory in Vercel dashboard: `AdminSideBackend`

See `.env.example` for required environment variables.

## Scripts

- `npm run dev` — local server with nodemon
- `npm run start` — local production start
- `npm run build` / `npm run vercel-build` — Prisma generate (+ migrate on Vercel)
- `npm run prisma:seed` — seed default admin
