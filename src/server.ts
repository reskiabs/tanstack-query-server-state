/// <reference types="bun" />
const dbPath = `${import.meta.dir}/../db.json`;

interface Db {
  user: {
    id: number;
    name: string;
    email: string;
  };
  todos: Array<{
    id: string;
    todo: string;
    createdAt: string;
    userId: number;
  }>;
}

const CORS_HEADERS = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Headers": "Content-Type",
  },
};

async function loadDb(): Promise<Db> {
  const data = Bun.file(dbPath);
  return (await data.json()) as Db;
}

async function delay(ms: number = 2000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const server = Bun.serve({
  port: 3001,
  routes: {
    "/user": async () => {
      await delay();

      const db = await loadDb();
      return Response.json(db.user, CORS_HEADERS);
    },
    "/todos": async (req: Request) => {
      await delay();

      if (req.method === "POST") {
        const body = await req.json();

        const db = await loadDb();
        const newId = crypto.randomUUID();
        const userId = body.userId !== undefined ? body.userId : 1;

        const todo = {
          id: newId,
          todo: body.todo ?? "",
          createdAt: new Date().toISOString(),
          userId: userId,
        };

        db.todos.push(todo);

        await Bun.write(dbPath, JSON.stringify(db, null, 2));

        return Response.json(todo, {
          ...CORS_HEADERS,
          status: 201,
        });
      }

      if (req.method === "GET") {
        const db = await loadDb();
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        const sortedTodos = [...db.todos].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (userId !== null) {
          const id = Number(userId);
          const filtered = sortedTodos.filter((t) => t.userId === id);
          return Response.json(filtered, CORS_HEADERS);
        }

        return Response.json(sortedTodos, CORS_HEADERS);
      }

      // CORS preflight or other
      if (req.method === "OPTIONS") {
        return new Response(null, CORS_HEADERS);
      }

      return new Response("Method Not Allowed", {
        ...CORS_HEADERS,
        status: 405,
      });
    },
  },
  fetch(req: Request) {
    return new Response(`Not Found: ${req.url}`, {
      ...CORS_HEADERS,
      status: 404,
    });
  },
  error(error: Error) {
    console.error(error);
    return new Response("Internal Server Error", {
      ...CORS_HEADERS,
      status: 500,
    });
  },
});

console.log(`Server running at ${server.url}`);
console.log("  GET /user");
console.log("  GET /todos");
console.log("  GET /todos?userId=<id>");
