"use server";

import { desc, eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db/client";
import { todos, type Todo as DbTodo } from "@/db/schema";
import { syncAfter, syncBefore } from "./turso";

export type Todo = DbTodo;

export type TodoActionResult = {
  ok: boolean;
  message?: string;
};

export async function listTodos(): Promise<Todo[]> {
  await syncBefore();

  const db = await getDb();

  return db.select().from(todos).orderBy(desc(todos.createdAt), desc(todos.id));
}

export async function addTodo(formData: FormData): Promise<TodoActionResult> {
  const text = String(formData.get("text") ?? "").trim();

  if (!text) {
    return { ok: false, message: "Todo text is required." };
  }

  const db = await getDb();

  await db.insert(todos).values({ text });
  await syncAfter();

  revalidatePath("/");
  return { ok: true };
}

export async function toggleTodo(id: number): Promise<TodoActionResult> {
  const db = await getDb();

  await db
    .update(todos)
    .set({ completed: not(todos.completed) })
    .where(eq(todos.id, id));
  await syncAfter();

  revalidatePath("/");
  return { ok: true };
}

export async function deleteTodo(id: number): Promise<TodoActionResult> {
  const db = await getDb();

  await db.delete(todos).where(eq(todos.id, id));
  await syncAfter();

  revalidatePath("/");
  return { ok: true };
}
