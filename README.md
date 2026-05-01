# nextjs-turso-vercel

Next.js + Turso on Vercel demo app

## Overview

This repository contains a Next.js App Router demo that connects to Turso
hosted SQLite from Vercel. The first implementation step sets up the pinned
Next.js project foundation. The next step adds the Turso client, schema, server
actions, and todo UI.

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

## Environment

Copy `.env.example` and set the Turso values for the target environment.
Production on Vercel should use `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
only. Local embedded replica development can also set `TURSO_SYNC_URL` and
`TURSO_SYNC_INTERVAL`.
