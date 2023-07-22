import { NewTodoForm } from "@/todos/new-todo-form";
import { QueryProvider } from "./query";
import { Card } from "@/components/ui/card";
import { cacheTags } from "@/lib/caching";
import { Todo, todosList } from "@/todos/serializers";
import { RelativeTime } from "@/components/dates/relative-time";

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
	const partitions = partitionTodos(data.todos);

	return (
		<main className="min-h-screen p-4 md:p-24">
			<QueryProvider>
				<div className="mx-auto p-4 md:max-w-lg">
					<Card className="p-4 mb-8">
						<NewTodoForm />
					</Card>

					<div className="space-y-4">
						{partitions.map(([bucket, todos]) => {
							if (!todos.length) {
								return null;
							}
							return (
								<ul
									key={bucket}
									className="rounded-xl border px-4 py-2 divide-y"
								>
									{todos.map((todo) => {
										return (
											<li key={todo.id} className="py-2">
												<p>{todo.title}</p>
												<p className="text-muted-foreground">
													<RelativeTime date={todo.createdAt} />
												</p>
											</li>
										);
									})}
								</ul>
							);
						})}
					</div>
				</div>
			</QueryProvider>
		</main>
	);
}

function truncateTime(inp: string | Date) {
	return new Date(inp);
}

function partitionTodos(todos: Todo[]) {
	const today = truncateTime(new Date()).getTime();
	const d = 86_400_000;
	const partitions: [bucket: number, items: Todo[]][] = [
		[d, []],
		[2 * d, []],
		[3 * d, []],
		[Infinity, []],
	];

	todos.forEach((todo) => {
		const diff = truncateTime(todo.createdAt).getTime() - today;
		const index = partitions.findIndex(([limit]) => -1 * diff < limit);
		if (index < 0) {
			throw new Error("unexpected todo item created in the future");
		}
		partitions[index][1].push(todo);
	});

	return partitions;
}
