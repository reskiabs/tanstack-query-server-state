import { Alert, AlertDescription, AlertTitle } from "@/components/selia/alert";
import { Button } from "@/components/selia/button";
import { Heading } from "@/components/selia/heading";
import { Input } from "@/components/selia/input";
import { Item, ItemContent, ItemTitle } from "@/components/selia/item";
import { Separator } from "@/components/selia/separator";
import { Stack } from "@/components/selia/stack";
import { Loader2Icon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Todo = {
  id: number;
  todo: string;
  createdAt: string;
  userId: number;
};

export function StandardFetch() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodo();
  }, []);

  async function fetchTodo() {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/todos");
      const data = await response.json();

      // purposely throw an error
      // throw new Error("Failed to fetch todos");

      setTodos(data);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Heading>Todo List</Heading>
      <TodoForm onSuccess={() => fetchTodo()} />
      <Separator className="my-8" />

      {loading && (
        <div className="flex justify-center">
          <Loader2Icon className="size-8 animate-spin" />
        </div>
      )}

      {error && (
        <Alert variant="danger">
          <XCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <Stack>
          {todos.map((todo) => (
            <Item key={todo.id}>
              <ItemContent>
                <ItemTitle>{todo.todo}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </Stack>
      )}
    </div>
  );
}

function TodoForm({ onSuccess }: { onSuccess: () => void }) {
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await fetch("http://localhost:3001/todos", {
        method: "POST",
        body: JSON.stringify({ todo }),
      });

      setTodo("");

      onSuccess();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        setError(error.message);
        return;
      }

      setError("Failed to add todo");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="flex gap-2 mt-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Add a new todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button type="submit" progress={loading}>
          Add
        </Button>
      </form>

      {error ? (
        <Alert variant="danger">
          <XCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
