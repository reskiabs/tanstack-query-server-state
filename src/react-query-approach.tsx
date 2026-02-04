import { Button } from "@/components/selia/button";
import { Heading } from "@/components/selia/heading";
import { Input } from "@/components/selia/input";
import { Item, ItemContent, ItemTitle } from "@/components/selia/item";
import { Separator } from "@/components/selia/separator";
import { Stack } from "@/components/selia/stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./components/selia/alert";

type Todo = {
  id: number;
  todo: string;
  createdAt: string;
  userId: number;
};

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export function ReactQueryApproach() {
  const { data: user } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/user");

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      return data as User;
    },
  });

  const {
    data: todos,
    isLoading,
    error,
    isError,
  } = useQuery<Todo[]>({
    enabled: !!user,
    queryKey: ["todos", user?.id],
    queryFn: async ({ queryKey: [, userId] }) => {
      const response = await fetch(
        `http://localhost:3001/todos?userId=${userId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const data = await response.json();
      return data as Todo[];
    },
    staleTime: 1000 * 5, // 5 seconds
    retry: false,
    select: (data) => {
      return data.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
      }));
    },
  });

  console.log(todos);
  return (
    <div className="max-w-2xl mx-auto py-6">
      <Heading>Todo List</Heading>
      <TodoForm />
      <Separator className="my-8" />

      {isLoading && (
        <div className="flex justify-center">
          <Loader2Icon className="size-8 animate-spin" />
        </div>
      )}

      {isError ? (
        <Alert variant="danger">
          <XCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : null}

      {todos && todos.length > 0 ? (
        <Stack>
          {todos.map((todo) => (
            <Item key={todo.id}>
              <ItemContent>
                <ItemTitle>{todo.todo}</ItemTitle>
              </ItemContent>
            </Item>
          ))}
        </Stack>
      ) : null}
    </div>
  );
}

function TodoForm() {
  const [todo, setTodo] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: async ({ newTodo }: { newTodo: string }) => {
      const response = await fetch("http://localhost:3001/todos", {
        method: "POST",
        body: JSON.stringify({ todo: newTodo }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      setTodo("");

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    mutate({ newTodo: todo });
  }

  return (
    <>
      <form className="flex gap-2 mt-4" onSubmit={handleSubmit}>
        <Input
          placeholder="Add a new todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <Button type="submit" progress={isPending}>
          Add
        </Button>
      </form>

      {isError ? (
        <Alert variant="danger">
          <XCircleIcon />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>{error?.message}</AlertDescription>
        </Alert>
      ) : null}
    </>
  );
}
