"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTodoForm, createTodoForm } from "./forms";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewTodoForm() {
	const router = useRouter();
	const form = useForm<CreateTodoForm>({
		resolver: zodResolver(createTodoForm),
		defaultValues: {
			title: "",
			status: "pending",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: CreateTodoForm) => {
			const result = await fetch("/api/todos", {
				method: "post",
				body: JSON.stringify(data),
			});

			if (result.ok) {
				form.reset();
				router.refresh();
			}
		},
	});

	return (
		<Form {...form}>
			<form
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
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input className="h-12 text-2xl" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<Button className="mt-4" type="submit">
					Save
				</Button>
			</form>
		</Form>
	);
}
