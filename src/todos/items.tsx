"use client";

import { RelativeTime } from "@/components/dates/relative-time";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Todo } from "./serializers";
import { TodoToggle } from "./todo-toggle";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UpdateTodoForm, updateTodoForm } from "./forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Input } from "@/components/ui/input";

export function TodoListItem(props: { item: Todo }) {
	const { item } = props;
	const [editing, setEditing] = useState(false);

	let content = editing ? (
		<TodoInlineEditForm
			item={item}
			onSuccess={() => setEditing(false)}
			onCancel={() => setEditing(false)}
		/>
	) : (
		<TodoItemDetail item={item} />
	);

	return (
		<div className="group grid grid-cols-[auto_max-content_max-content] items-center gap-4">
			{content}

			<TodoItemAction editing={editing} onClick={() => setEditing((v) => !v)} />

			<TodoToggle id={item.id} initialStatus={item.status} />
		</div>
	);
}

function TodoItemAction(props: { editing: boolean; onClick(): void }) {
	const { editing, onClick } = props;

	if (editing) {
		return (
			<Button variant="link" onClick={onClick}>
				Cancel
			</Button>
		);
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className="opacity-30 group-hover:opacity-100 group-focus-within:opacity-100"
						variant="ghost"
						size="icon"
						onClick={onClick}
					>
						<Pencil1Icon />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Edit todo</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function TodoItemDetail(props: { item: Todo }) {
	const { item } = props;
	return (
		<div>
			<p>{item.title}</p>
			<p className="text-muted-foreground">
				<RelativeTime date={item.createdAt} />
			</p>
		</div>
	);
}

function TodoInlineEditForm(props: {
	item: Todo;
	onSuccess(): void;
	onCancel(): void;
}) {
	const { item, onSuccess, onCancel } = props;
	const router = useRouter();
	const form = useForm<UpdateTodoForm>({
		resolver: zodResolver(updateTodoForm),
		defaultValues: {
			id: parseInt(item.id, 10),
			title: item.title,
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: UpdateTodoForm) => {
			const result = await fetch(`/api/todos/${item.id}/edit`, {
				method: "post",
				body: JSON.stringify(data),
			});

			if (!result.ok) {
				throw new Error(
					`Unable to create todo entry: server responded with ${result.status}`,
				);
			}
			return result;
		},
		onSuccess: () => {
			form.reset();
			router.refresh();
			onSuccess();
		},
	});

	return (
		<Form {...form}>
			<form
				className="py-[6px]"
				onSubmit={form.handleSubmit((f, e) => {
					e?.preventDefault();
					mutation.mutate(f);
				})}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel hidden>Title</FormLabel>
								<FormControl>
									<Input
										autoFocus
										onKeyUp={(e) => {
											if (e.key === "Escape") {
												onCancel();
											}
										}}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<Button className="sr-only" type="submit">
					Update
				</Button>
			</form>
		</Form>
	);
}
