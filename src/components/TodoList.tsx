"use client";

import type { Todo } from "@/lib/todos";
import { TodoItem } from "./TodoItem";

type TodoListProps = {
  disabled: boolean;
  todos: Todo[];
  onError: (message: string | undefined) => void;
  onOptimisticDelete: (id: number) => void;
  onOptimisticToggle: (id: number) => void;
};

export function TodoList({
  disabled,
  todos,
  onError,
  onOptimisticDelete,
  onOptimisticToggle,
}: TodoListProps) {
  if (todos.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        No todos yet.
      </section>
    );
  }

  return (
    <ul className="rounded-lg border border-zinc-200 bg-white px-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          disabled={disabled}
          todo={todo}
          onError={onError}
          onOptimisticDelete={onOptimisticDelete}
          onOptimisticToggle={onOptimisticToggle}
        />
      ))}
    </ul>
  );
}
