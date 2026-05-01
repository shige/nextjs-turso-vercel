import { getTursoDriver } from "@/lib/turso";
import * as schema from "./schema";

type AppDb = any;

let cachedDb: AppDb | undefined;

export async function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const resolved = await getTursoDriver();

  if (resolved.mode === "remote") {
    const { drizzle } = await import("drizzle-orm/libsql");

    cachedDb = drizzle({
      client: resolved.driver as never,
      schema,
    }) as unknown as AppDb;
  } else {
    const { drizzle } = await import("drizzle-orm/tursodatabase/database");

    cachedDb = drizzle({
      client: resolved.driver as never,
      schema,
    }) as unknown as AppDb;
  }

  return cachedDb;
}
