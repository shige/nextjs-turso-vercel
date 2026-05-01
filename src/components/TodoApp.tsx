"use client";

import { useOptimistic, useState, useTransition } from "react";
import type { Todo } from "@/lib/todos";
import { TodoForm } from "./TodoForm";
import { TodoList } from "./TodoList";

type OptimisticAction =
  | { type: "add"; todo: Todo }
  | { type: "toggle"; id: number }
  | { type: "delete"; id: number };

type TodoAppProps = {
  initialTodos: Todo[];
  isConfigured: boolean;
  setupError?: string;
};

export function TodoApp({
  initialTodos,
  isConfigured,
  setupError,
}: TodoAppProps) {
  const [message, setMessage] = useState<string | undefined>(setupError);
  const [, startOptimisticTransition] = useTransition();
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    initialTodos,
    (todos, action: OptimisticAction) => {
      switch (action.type) {
        case "add":
          return [action.todo, ...todos];
        case "toggle":
          return todos.map((todo) =>
            todo.id === action.id
              ? { ...todo, completed: !todo.completed }
              : todo,
          );
        case "delete":
          return todos.filter((todo) => todo.id !== action.id);
      }
    },
  );

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="border-b border-zinc-200 pb-6">
          <p className="text-sm font-semibold uppercase text-teal-700">
            Next.js + Turso + Vercel
          </p>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Todo demo
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            A server-rendered todo app backed by Turso/libSQL and updated with
            Server Actions.
          </p>
        </header>

        {!isConfigured ? (
          <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to enable database
            reads and writes.
          </section>
        ) : null}

        {message ? (
          <section className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900">
            {message}
          </section>
        ) : null}

        <TodoForm
          disabled={!isConfigured}
          onError={setMessage}
          onOptimisticAdd={(text) => {
            startOptimisticTransition(() => {
              addOptimisticTodo({
                type: "add",
                todo: {
                  id: -Date.now(),
                  text,
                  completed: false,
                  createdAt: new Date().toISOString(),
                },
              });
            });
          }}
        />

        <TodoList
          disabled={!isConfigured}
          todos={optimisticTodos}
          onError={setMessage}
          onOptimisticDelete={(id) => {
            startOptimisticTransition(() => {
              addOptimisticTodo({ type: "delete", id });
            });
          }}
          onOptimisticToggle={(id) => {
            startOptimisticTransition(() => {
              addOptimisticTodo({ type: "toggle", id });
            });
          }}
        />
      </div>
    </main>
  );
}
