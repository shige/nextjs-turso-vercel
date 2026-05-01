"use server";

import { revalidatePath } from "next/cache";
import { getTurso } from "./turso";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
};

export type TodoActionResult = {
  ok: boolean;
  message?: string;
};

export async function listTodos(): Promise<Todo[]> {
  const result = await getTurso().execute(
    "SELECT id, text, completed, created_at FROM todos ORDER BY created_at DESC, id DESC",
  );

  return result.rows.map((row) => ({
    id: Number(row.id),
    text: String(row.text),
    completed: Boolean(Number(row.completed)),
    createdAt: String(row.created_at),
  }));
}

export async function addTodo(formData: FormData): Promise<TodoActionResult> {
  const text = String(formData.get("text") ?? "").trim();

  if (!text) {
    return { ok: false, message: "Todo text is required." };
  }

  await getTurso().execute({
    sql: "INSERT INTO todos (text) VALUES (?)",
    args: [text],
  });

  revalidatePath("/");
  return { ok: true };
}

export async function toggleTodo(id: number): Promise<TodoActionResult> {
  await getTurso().execute({
    sql: "UPDATE todos SET completed = 1 - completed WHERE id = ?",
    args: [id],
  });

  revalidatePath("/");
  return { ok: true };
}

export async function deleteTodo(id: number): Promise<TodoActionResult> {
  await getTurso().execute({
    sql: "DELETE FROM todos WHERE id = ?",
    args: [id],
  });

  revalidatePath("/");
  return { ok: true };
}
