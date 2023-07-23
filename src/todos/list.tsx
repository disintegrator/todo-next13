import { RelativeTime } from "@/components/dates/relative-time";
import { Todo } from "./serializers";
import { TodoToggle } from "./todo-toggle";

export type TodoListProps = {
	items: Todo[];
};

export function TodoList(props: TodoListProps) {
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

function TodoListItem(props: { item: Todo }) {
	const { item } = props;
	return (
		<div className="grid grid-cols-[auto_max-content] items-center">
			<div>
				<p>{item.title}</p>
				<p className="text-muted-foreground">
					<RelativeTime date={item.createdAt} />
				</p>
			</div>
			<TodoToggle id={item.id} initialStatus={item.status} />
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
