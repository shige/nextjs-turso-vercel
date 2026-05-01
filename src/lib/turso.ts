import { createClient, type Client } from "@libsql/client";

let client: Client | undefined;

export function hasTursoConfig() {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export function getTurso() {
  const databaseUrl = process.env.TURSO_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("TURSO_DATABASE_URL is required.");
  }

  if (!client) {
    const syncUrl = process.env.TURSO_SYNC_URL;

    client = createClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
      ...(syncUrl
        ? {
            syncUrl,
            syncInterval: Number(process.env.TURSO_SYNC_INTERVAL ?? 60) * 1000,
          }
        : {}),
    });
  }

  return client;
}

export async function syncTurso() {
  if (process.env.TURSO_SYNC_URL) {
    await getTurso().sync();
  }
}
