import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { drizzle as drizzleTurso } from "drizzle-orm/tursodatabase/database";
import { getTursoDriver } from "@/lib/turso";
import * as schema from "./schema";

type AppDb = ReturnType<typeof drizzleTurso<typeof schema>>;

let cachedDb: AppDb | undefined;

export async function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  const resolved = await getTursoDriver();

  cachedDb =
    resolved.mode === "remote"
      ? (drizzleLibsql({
          client: resolved.driver as never,
          schema,
        }) as unknown as AppDb)
      : drizzleTurso({ client: resolved.driver as never, schema });

  return cachedDb;
}
