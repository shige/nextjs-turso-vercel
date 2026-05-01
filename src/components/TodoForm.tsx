"use client";

import { useRef, useTransition } from "react";
import { addTodo } from "@/lib/todos";

type TodoFormProps = {
  disabled: boolean;
  onError: (message: string | undefined) => void;
  onOptimisticAdd: (text: string) => void;
};

export function TodoForm({
  disabled,
  onError,
  onOptimisticAdd,
}: TodoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      action={(formData) => {
        const text = String(formData.get("text") ?? "").trim();

        if (!text) {
          onError("Todo text is required.");
          return;
        }

        onError(undefined);
        onOptimisticAdd(text);
        formRef.current?.reset();

        startTransition(async () => {
          const result = await addTodo(formData);

          if (!result.ok) {
            onError(result.message ?? "Could not add the todo.");
          }
        });
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="todo-text">
        Todo text
      </label>
      <input
        id="todo-text"
        name="text"
        type="text"
        disabled={disabled || isPending}
        placeholder="Add a todo"
        className="min-h-12 flex-1 rounded-lg border border-zinc-300 bg-white px-4 text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-zinc-100"
      />
      <button
        type="submit"
        disabled={disabled || isPending}
        className="min-h-12 rounded-lg bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {isPending ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
