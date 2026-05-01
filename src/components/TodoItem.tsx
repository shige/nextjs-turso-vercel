"use client";

import { useTransition } from "react";
import { deleteTodo, toggleTodo, type Todo } from "@/lib/todos";

type TodoItemProps = {
  disabled: boolean;
  todo: Todo;
  onError: (message: string | undefined) => void;
  onOptimisticDelete: (id: number) => void;
  onOptimisticToggle: (id: number) => void;
};

export function TodoItem({
  disabled,
  todo,
  onError,
  onOptimisticDelete,
  onOptimisticToggle,
}: TodoItemProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex items-start gap-3 border-b border-zinc-200 py-4 last:border-b-0">
      <button
        type="button"
        disabled={disabled || isPending}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        onClick={() => {
          onError(undefined);
          onOptimisticToggle(todo.id);

          startTransition(async () => {
            const result = await toggleTodo(todo.id);

            if (!result.ok) {
              onError(result.message ?? "Could not update the todo.");
            }
          });
        }}
        className="mt-1 grid size-5 shrink-0 place-items-center rounded border border-zinc-400 bg-white text-xs font-bold text-white transition hover:border-teal-700 disabled:cursor-not-allowed"
      >
        <span
          className={
            todo.completed
              ? "block size-3 rounded-sm bg-teal-700"
              : "block size-3 rounded-sm bg-transparent"
          }
        />
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={
            todo.completed
              ? "break-words text-base leading-7 text-zinc-500 line-through"
              : "break-words text-base leading-7 text-zinc-950"
          }
        >
          {todo.text}
        </p>
        <p className="mt-1 text-xs text-zinc-500">{todo.createdAt}</p>
      </div>

      <button
        type="button"
        disabled={disabled || isPending}
        onClick={() => {
          onError(undefined);
          onOptimisticDelete(todo.id);

          startTransition(async () => {
            const result = await deleteTodo(todo.id);

            if (!result.ok) {
              onError(result.message ?? "Could not delete the todo.");
            }
          });
        }}
        className="rounded-md px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-zinc-400"
      >
        Delete
      </button>
    </li>
  );
}
