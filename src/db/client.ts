import { drizzle } from "drizzle-orm/libsql";
import { getTurso } from "@/lib/turso";
import * as schema from "./schema";

export const db = drizzle(getTurso(), { schema });
