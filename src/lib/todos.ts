"use server";

import { desc, eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { todos, type Todo as DbTodo } from "@/db/schema";
import { syncTurso } from "./turso";

export type Todo = DbTodo;

export type TodoActionResult = {
  ok: boolean;
  message?: string;
};

export async function listTodos(): Promise<Todo[]> {
  await syncTurso();

  return db.select().from(todos).orderBy(desc(todos.createdAt), desc(todos.id));
}

export async function addTodo(formData: FormData): Promise<TodoActionResult> {
  const text = String(formData.get("text") ?? "").trim();

  if (!text) {
    return { ok: false, message: "Todo text is required." };
  }

  await db.insert(todos).values({ text });
  await syncTurso();

  revalidatePath("/");
  return { ok: true };
}

export async function toggleTodo(id: number): Promise<TodoActionResult> {
  await db
    .update(todos)
    .set({ completed: not(todos.completed) })
    .where(eq(todos.id, id));
  await syncTurso();

  revalidatePath("/");
  return { ok: true };
}

export async function deleteTodo(id: number): Promise<TodoActionResult> {
  await db.delete(todos).where(eq(todos.id, id));
  await syncTurso();

  revalidatePath("/");
  return { ok: true };
}
