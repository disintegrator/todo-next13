import { TodoListItem } from "./items";
import { Todo } from "./serializers";

export type TodoListProps = {
	items: Todo[];
};

export function TodoList(props: TodoListProps) {
	if (!props.items.length) {
		return null;
	}

	const partitions = partitionTodos(props.items);

	return (
		<div className="space-y-4">
			{partitions.map(([bucket, todos]) => {
				if (!todos.length) {
					return null;
				}
				return (
					<ul key={bucket} className="rounded-xl border px-4 py-2 divide-y">
						{todos.map((todo) => {
							return (
								<li key={todo.id} className="py-2">
									<TodoListItem item={todo} />
								</li>
							);
						})}
					</ul>
				);
			})}
		</div>
	);
}

function partitionTodos(todos: Todo[]) {
	const today = new Date().getTime();
	const d = 86_400_000;
	const partitions: [bucket: number, items: Todo[]][] = [
		[d, []],
		[2 * d, []],
		[3 * d, []],
		[Infinity, []],
	];

	todos.forEach((todo) => {
		const diff = new Date(todo.createdAt).getTime() - today;
		const index = partitions.findIndex(([limit]) => -1 * diff < limit);
		if (index < 0) {
			throw new Error("unexpected todo item created in the future");
		}
		partitions[index][1].push(todo);
	});

	return partitions;
}
