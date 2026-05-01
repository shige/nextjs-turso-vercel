type TursoMode = "remote" | "local" | "sync";

type RemoteDriver = Awaited<
  ReturnType<
    typeof import("@tursodatabase/serverless/compat")["createClient"]
  >
>;
type LocalDriver = import("@tursodatabase/database").Database;
type SyncDriver = import("@tursodatabase/sync").Database;

export type TursoDriver =
  | { mode: "remote"; driver: RemoteDriver }
  | { mode: "local"; driver: LocalDriver }
  | { mode: "sync"; driver: SyncDriver };

let cachedDriver: Promise<TursoDriver> | undefined;

export function hasTursoConfig() {
  return Boolean(process.env.TURSO_DATABASE_URL);
}

export function getTursoDriver() {
  if (!cachedDriver) {
    cachedDriver = resolveTursoDriver();
  }

  return cachedDriver;
}

export async function syncBefore() {
  const resolved = await getTursoDriver();

  if (resolved.mode === "sync") {
    await resolved.driver.pull();
  }
}

export async function syncAfter() {
  const resolved = await getTursoDriver();

  if (resolved.mode === "sync") {
    await resolved.driver.push();
  }
}

async function resolveTursoDriver(): Promise<TursoDriver> {
  const databaseUrl = process.env.TURSO_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("TURSO_DATABASE_URL is required.");
  }

  const syncUrl = process.env.TURSO_SYNC_URL;

  if (isRemoteUrl(databaseUrl)) {
    if (syncUrl) {
      console.warn(
        "TURSO_SYNC_URL is set with a remote TURSO_DATABASE_URL. Sync mode requires a file: URL, so TURSO_SYNC_URL will be ignored.",
      );
    }

    const { createClient } = await import("@tursodatabase/serverless/compat");

    return {
      mode: "remote",
      driver: createClient({
        url: databaseUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    };
  }

  const path = databaseUrl.replace(/^file:/, "");

  if (syncUrl) {
    const { connect } = await import("@tursodatabase/sync");

    return {
      mode: "sync",
      driver: await connect({
        path,
        url: syncUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    };
  }

  const { Database } = await import("@tursodatabase/database");

  return {
    mode: "local",
    driver: new Database(path),
  };
}

function isRemoteUrl(url: string) {
  return url.startsWith("libsql://") || url.startsWith("https://");
}
