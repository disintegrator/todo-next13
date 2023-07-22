import { z } from "zod";

const sqDateTime = z
	.string()
	.transform((v) => new Date(`${v.replace(" ", "T")}Z`).toISOString());

export const todo = z.object({
	id: z.string(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
	status: z.enum(["pending", "done", "deleted"]),
	title: z.string(),
});

export type Todo = z.infer<typeof todo>;

export const todosList = z.object({ todos: z.array(todo) });

export const serializedTodo = z
	.object({
		id: z.number().transform((v) => `${v}`),
		createdAt: sqDateTime,
		updatedAt: sqDateTime,
		status: z.enum(["pending", "done", "deleted"]),
		title: z.string(),
	})
	.pipe(todo);

export const serializedTodos = z.array(serializedTodo);
