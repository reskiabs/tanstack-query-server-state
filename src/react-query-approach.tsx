import { Alert, AlertDescription, AlertTitle } from "@/components/selia/alert";
import { Button } from "@/components/selia/button";
import { Heading } from "@/components/selia/heading";
import { Input } from "@/components/selia/input";
import { Item, ItemContent, ItemTitle } from "@/components/selia/item";
import { Separator } from "@/components/selia/separator";
import { Stack } from "@/components/selia/stack";
import { Loader2Icon, XCircleIcon } from "lucide-react";

type Todo = {
  id: number;
  todo: string;
  createdAt: string;
  userId: number;
};

export function ReactQueryApproach() {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <Heading>Todo List</Heading>
      {/* <TodoForm /> */}
      <Separator className="my-8" />

      {/* <div className="flex justify-center">
        <Loader2Icon className="size-8 animate-spin" />
      </div> */}

      {/* <Alert variant="danger">
        <XCircleIcon />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert> */}

      {/* <Stack>
        {todos.map((todo) => (
          <Item key={todo.id}>
            <ItemContent>
              <ItemTitle>{todo.todo}</ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </Stack> */}
    </div>
  );
}

// function TodoForm() {
//   const [todo, setTodo] = useState("");

//   async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
//     event.preventDefault();
//   }

//   return (
//     <>
//       <form className="flex gap-2 mt-4" onSubmit={handleSubmit}>
//         <Input
//           placeholder="Add a new todo"
//           value={todo}
//           onChange={(e) => setTodo(e.target.value)}
//         />
//         <Button type="submit" progress={loading}>
//           Add
//         </Button>
//       </form>

//       {error ? (
//         <Alert variant="danger">
//           <XCircleIcon />
//           <AlertTitle>Something went wrong</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       ) : null}
//     </>
//   );
// }
