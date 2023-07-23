"use client";

import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { UpdateTodoForm, updateTodoForm } from "./forms";
import { Switch } from "@/components/ui/switch";
import { Todo } from "./serializers";
import { useEffect } from "react";

export function TodoToggle(props: {
	id: string;
	initialStatus: Todo["status"];
}) {
	const form = useForm<UpdateTodoForm>({
		resolver: zodResolver(updateTodoForm),
		defaultValues: {
			id: parseInt(props.id, 10),
			status: props.initialStatus === "deleted" ? "done" : props.initialStatus,
		},
	});

	const { watch, handleSubmit } = form;

	const mutation = useMutation({
		mutationFn: async (data: UpdateTodoForm) => {
			return fetch(`/api/todos/${props.id}/edit`, {
				method: "post",
				body: JSON.stringify(data),
			});
		},
	});

	const onSubmit = handleSubmit((f, e) => {
		e?.preventDefault();
		mutation.mutate(f);
	});

	useEffect(() => {
		const subscription = watch(() => onSubmit());
		return () => subscription.unsubscribe();
	}, [onSubmit, watch]);

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => {
						return (
							<FormItem>
								<FormLabel className="hidden">Toggle done</FormLabel>
								<FormControl>
									<Switch
										checked={field.value === "done"}
										onCheckedChange={(e) => {
											field.onChange(e ? "done" : "pending");
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
			</form>
		</Form>
	);
}
