import { TodoApp } from "@/components/TodoApp";
import { hasTursoConfig } from "@/lib/turso";
import { listTodos, type Todo } from "@/lib/todos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const isConfigured = hasTursoConfig();
  let todos: Todo[] = [];
  let setupError: string | undefined;

  if (isConfigured) {
    try {
      todos = await listTodos();
    } catch (error) {
      setupError =
        error instanceof Error ? error.message : "Could not load todos.";
    }
  }

  return (
    <TodoApp
      initialTodos={todos}
      isConfigured={isConfigured}
      setupError={setupError}
    />
  );
}
