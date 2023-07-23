import { NewTodoForm } from "@/todos/new-todo-form";
import { QueryProvider } from "./query";
import { Card } from "@/components/ui/card";
import { cacheTags } from "@/lib/caching";
import { Todo, todosList } from "@/todos/serializers";
import { RelativeTime } from "@/components/dates/relative-time";
import { TodoList } from "@/todos/list";

async function getData() {
	const res = await fetch("http://localhost:3000/api/todos", {
		next: { revalidate: 10, tags: [cacheTags.todos()] },
	});
	// The return value is *not* serialized
	// You can return Date, Map, Set, etc.

	// Recommendation: handle errors
	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error("Failed to fetch data");
	}

	const data = await res.json();

	return todosList.parse(data);
}

export default async function Home() {
	const data = await getData();

	return (
		<main className="min-h-screen p-4 md:p-24">
			<QueryProvider>
				<div className="mx-auto p-4 md:max-w-lg">
					<Card className="p-4 mb-8">
						<NewTodoForm />
					</Card>

					<TodoList items={data.todos} />
				</div>
			</QueryProvider>
		</main>
	);
}
