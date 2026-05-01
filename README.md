# nextjs-turso-vercel

Next.js + Turso on Vercel demo app

## Overview

This repository contains a Next.js App Router demo that connects to Turso
hosted SQLite from Vercel. It uses Drizzle ORM on top of `@libsql/client`,
Server Components for reads, Server Actions for writes, and optimistic client
updates for todo interactions.

## Requirements

- Node.js 24.x (`.nvmrc` pins local development to 24.15.0)
- pnpm 10.33.2

The package manager version is enforced through `package.json` and `.npmrc`.
Vercel only selects the Node.js major version, so `package.json` uses `24.x`
while `.nvmrc` keeps local development pinned to 24.15.0.

## Development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Database Setup

Create the Turso database, create an auth token, then apply the Drizzle
migrations:

```bash
turso db create nextjs-turso-vercel
turso db tokens create nextjs-turso-vercel
pnpm db:migrate
```

`drizzle-kit migrate` should target the remote Turso database. If local
development uses `TURSO_DATABASE_URL=file:local-replica.db`, keep a separate
remote-only environment file for migrations and load it before running
`pnpm db:migrate`.

Generate new migrations after schema changes with:

```bash
pnpm db:generate
```

## Environment

Copy `.env.example` and set the Turso values for the target environment.
Production on Vercel should use `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
only. Local embedded replica development can also set `TURSO_SYNC_URL` and
`TURSO_SYNC_INTERVAL`.

## Vercel

Set these environment variables in the Vercel project:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

Do not set `TURSO_SYNC_URL` in production. Vercel serverless functions should
connect directly to the hosted Turso database because a local file replica does
not persist between invocations.

Deploy with:

```bash
vercel deploy --scope tadashi-shigeoka
```
