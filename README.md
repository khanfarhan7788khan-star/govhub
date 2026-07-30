# GovHub

A directory of official Indian government websites — real Next.js app, real SQLite
database, real authentication. Not a static demo: every button, form, and admin
action reads from and writes to an actual database.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **SQLite** via `better-sqlite3` — file-based, zero external services required
- **Auth**: bcrypt-hashed passwords + JWT session cookies for the admin area
- **Validation**: Zod on every write endpoint
- Plain CSS design system (fonts via Google Fonts CSS import) — no UI framework lock-in

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. The SQLite database is created automatically at
`data/govhub.db` on first run and seeded with 23 verified government portals,
22 categories, and one admin account.

### Seeded admin login

```
URL:      /admin
Email:    admin@govhub.in
Password: Admin@123
```

**Change this password (or delete the seeded row and re-register one) before putting
this anywhere public.** There's no self-serve "forgot password" flow yet — to change
it, update the `admins` table directly or extend `/api/auth`.

### Adding more admin accounts

There's no signup form for admins by design (it's a single-tenant directory, not a
multi-org SaaS). To add another admin, insert a row with a bcrypt hash of their
password — for example, from the project root:

```bash
node -e "console.log(require('bcryptjs').hashSync('their-password', 10))"
```

Then insert it into `data/govhub.db` (any SQLite client, or a one-off script using
`node:sqlite`):

```sql
INSERT INTO admins (id, email, password_hash)
VALUES ('admin-2', 'newadmin@govhub.in', '<paste the hash here>');
```

## What's real vs. what you still need to add

**Real and working:**
- Search, category/level filters, sort — all live SQLite queries
- Favourites, tied to an anonymous per-browser session cookie (no account needed)
- Contact form and "Suggest a website" form, both persisted to the database
- A public **Guide** page (`/guide`) walking users through finding, verifying, and
  applying/registering on an official portal
- Admin login/logout, protected dashboard routes (server-side redirect if not signed in)
- Full CRUD on listings and categories from the admin dashboard
- Broken-link reports (submit → admin resolves) and suggestion approvals
  (approving a suggestion actually publishes it as a live listing)
- Admin **Messages** inbox — view and delete contact form submissions

**Not included / intentionally out of scope:**
- Email delivery for the contact form (messages are stored, not emailed — wire up
  Resend/Postmark/etc. in `src/app/api/contact/route.ts` if you want notifications)
- Multi-admin management UI (there's one seeded admin; add more rows to `admins`
  with a bcrypt hash, or build a simple "invite admin" screen)
- Rate limiting / spam protection on public forms
- PWA/offline support, push notifications, multi-language UI

## Project structure

```
src/
  app/                  Routes (App Router) — pages + API routes under app/api/*
  components/           Client & shared UI components
  lib/
    db.ts               SQLite connection, schema, seed data
    sites.ts            Server-side data access helpers (reads)
    auth.ts             JWT signing/verification, admin session helper
    session.ts          Anonymous visitor session helper (favourites)
    types.ts            Shared TypeScript types
data/
  govhub.db             SQLite database file (created on first run, gitignored)
```

## Deployment

This runs anywhere Node.js runs: a VPS, Render, Railway, Fly.io, a Docker
container, etc. Build and start it like any Next.js app:

```bash
npm run build
npm run start
```

### ⚠️ Important if deploying to Vercel (or other serverless platforms)

SQLite is a **file on disk**. Vercel's serverless functions run on an ephemeral,
read-only-outside-of-`/tmp` filesystem — so `data/govhub.db` will not persist
between deployments or even between separate function invocations. The app will
still *build and boot* on Vercel, but writes (favourites, admin edits, form
submissions) can silently disappear.

If you want to deploy on Vercel, swap SQLite for a hosted Postgres database
(e.g. Neon or Supabase, both have generous free tiers):

1. `npm install pg` (or `@neondatabase/serverless`)
2. Replace `src/lib/db.ts` with a Postgres connection + equivalent schema
   (the SQL in `db.ts` is close to standard SQL — mainly swap `?` placeholders
   for `$1, $2…` and adjust the `datetime('now')` defaults to `now()`)
3. Everything in `src/lib/sites.ts` and the API routes stays the same shape —
   they call `db.prepare(...).get()/.all()/.run()`, so only the low-level
   driver call needs to change, not the business logic

On a normal VM/Render/Railway deployment with a persistent disk, none of this
applies — SQLite works as-is.

## Environment variables

Copy `.env.example` to `.env.local` and set a real secret before deploying:

```
JWT_SECRET=replace-with-a-long-random-string
```

If unset, a dev-only default is used — fine for local testing, **not** for
production.
