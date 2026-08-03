# GovHub

A directory of official Indian government websites — real Next.js app, real
Postgres database, real authentication. Not a static demo: every button, form,
and admin action reads from and writes to an actual database.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **PostgreSQL** via `pg` (node-postgres) — plain parameterized SQL, no ORM
- **Auth**: bcrypt-hashed passwords + JWT session cookies for the admin area
- **Validation**: Zod on every write endpoint
- Plain CSS design system (fonts via Google Fonts CSS import) — no UI framework lock-in

This runs on Vercel, Render, Railway, a VPS, Docker — anywhere Node.js runs and
you can point it at a Postgres database.

## Getting started

### 1. Get a Postgres database

The fastest option is a free [Neon](https://neon.tech) project — sign up, create
a project, and copy the connection string it gives you (it already includes
`?sslmode=require`). Supabase, Railway, or any other Postgres host works the
same way.

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=some-long-random-string
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. On the very first request, the app automatically
creates all tables and seeds 23 verified government portals, 22 categories, and
one admin account — no separate migration step needed.

### Seeded admin login

```
URL:      /admin
Email:    admin@govhub.in
Password: Admin@123
```

**Change this password before putting the site anywhere public.** There's no
self-serve "forgot password" flow — see "Adding more admin accounts" below.

### Adding more admin accounts

There's no signup form for admins by design. To add one, hash a password:

```bash
node -e "console.log(require('bcryptjs').hashSync('their-password', 10))"
```

Then insert it via `psql` (or any Postgres client) against your `DATABASE_URL`:

```sql
INSERT INTO admins (id, email, password_hash)
VALUES ('admin-2', 'newadmin@govhub.in', '<paste the hash here>');
```

## What's real vs. what you still need to add

**Real and working:**
- Search, category/level filters, sort — all live Postgres queries
- Favourites, tied to an anonymous per-browser session cookie (no account needed)
- Contact form and "Suggest a website" form, both persisted to the database
- A public **Guide** page (`/guide`) walking users through finding, verifying, and
  applying/registering on an official portal
- A full **blog/guides system** (`/blog`) — search, category filter, featured and
  popular articles, related-article linking, and 5 complete 1000+ word seeded
  guides (PAN card, Aadhaar download, passport, driving licence, PM-KISAN)
- **Enriched service pages** — 5 of the 23 listings (UIDAI, Income Tax, Passport,
  Parivahan, PM-KISAN) have full overview/benefits/eligibility/documents/fees/
  processing-time/step-by-step/FAQ sections; the rest show the original simpler
  view and gracefully degrade until content is added
- **SEO infrastructure**: dynamic per-page metadata, Open Graph and Twitter Card
  tags, canonical URLs, `sitemap.xml` (auto-includes every listing and article),
  `robots.txt`, and JSON-LD structured data (Organization, WebSite/SearchAction,
  BreadcrumbList, Article, FAQPage)
- **AdSense-ready components** (`AdBanner`, `SidebarAd`, `InArticleAd`,
  `StickyBottomAd`, `MultiplexAd`) — render a neutral placeholder box until you
  set a real `NEXT_PUBLIC_ADSENSE_CLIENT`, so nothing fake is ever served in
  production (serving placeholder/fake ads violates AdSense policy)
- Legal pages: Privacy, Terms, Disclaimer, Cookie Policy, plus an HTML sitemap page
- Custom 404 and error pages
- Admin login/logout, protected dashboard routes (server-side redirect if not signed in)
- Full CRUD on listings, categories, **articles, FAQs, and announcements** from
  the admin dashboard, plus a rich-content editor for enriching any service page
- Broken-link reports (submit → admin resolves) and suggestion approvals
  (approving a suggestion actually publishes it as a live listing)
- Admin **Messages** inbox — view and delete contact form submissions

**Not included / intentionally out of scope:**
- 25 of the 30 requested articles — 5 are seeded as complete, real, 1000+ word
  guides to prove the system end-to-end; add the rest through **Admin → Articles**
  (rushing 30 thin AI-generated articles in one pass would hurt your AdSense
  approval odds and SEO more than help — quality over quantity matters here)
- Rich content for 18 of the 23 service listings — the admin **Content** editor
  (pencil icon → file icon on any listing) is built specifically so you can fill
  these in incrementally
- Email delivery for the contact form (messages are stored, not emailed — wire up
  Resend/Postmark/etc. in `src/app/api/contact/route.ts` if you want notifications)
- Multi-admin management UI (add rows to `admins` directly, see above)
- Rate limiting / spam protection on public forms
- PWA/offline support, push notifications, multi-language UI
- Real AdSense integration — components are wired and ready, but you still need
  to apply for and be approved by AdSense, then set `NEXT_PUBLIC_ADSENSE_CLIENT`
  and the real per-slot IDs in each `<Ad... />` component usage

## Project structure

```
src/
  app/                  Routes (App Router) — pages + API routes under app/api/*
  components/           Client & shared UI components
  lib/
    db.ts               Postgres pool, schema migration, seed data
    sites.ts            Server-side data access helpers (async, reads)
    auth.ts              JWT signing/verification, admin session helper
    session.ts           Anonymous visitor session helper (favourites)
    types.ts              Shared TypeScript types
```

There's no `prisma/` directory and no ORM — every query in `src/lib/db.ts` and
the `src/app/api/*` routes is plain parameterized SQL via `pg`. If you previously
had a `prisma.config.ts` or `@prisma/client` in this repo from an earlier attempt,
they're gone; nothing in this codebase references Prisma.

## Deploying on Vercel

1. Push this repo to GitHub and import it in Vercel.
2. In the Vercel project's **Settings → Environment Variables**, add `DATABASE_URL`
   and `JWT_SECRET` (the same values from your `.env.local`).
3. Deploy. The first request in production will migrate and seed the database
   automatically, same as local dev.

This is the important part that a SQLite-based version *cannot* do: Vercel's
serverless functions have a read-only filesystem outside of `/tmp`, so a file-based
database can't persist there. A real Postgres connection over the network has no
such problem — reads and writes work exactly the same in production as they do
locally.

### ⚠️ Use Neon's *pooled* connection string in production

Neon gives you two connection strings: a **direct** one and a **pooled** one
(the pooled hostname contains `-pooler`, e.g. `ep-xxx-pooler.us-east-1.aws.neon.tech`).
**Use the pooled one for `DATABASE_URL` on Vercel.**

Why this matters: every serverless function instance opens its own small
connection pool, and under real traffic Vercel can run many instances at once.
Against a *direct* Postgres connection, that can add up to more simultaneous
connections than Postgres allows, causing intermittent "too many clients"
errors. The pooled connection routes through PgBouncer, which multiplexes many
client connections into far fewer real ones — this is exactly the scenario it's
designed for. Locally, either connection string works fine since you're only
running one instance.

## Deploying anywhere else

Render, Railway, Fly.io, a VPS, Docker — all of these work the same way:

```bash
npm run build
npm run start
```

with `DATABASE_URL` and `JWT_SECRET` set in the environment. No persistent local
disk is required since all state lives in Postgres.
