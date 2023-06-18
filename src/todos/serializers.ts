import { z } from "zod";

const sqDateTime = z
	.string()
	.transform((v) => new Date(`${v.replace(" ", "T")}Z`).toISOString());

export const serializedTodo = z.object({
	id: z.number().transform((v) => `${v}`),
	createdAt: sqDateTime,
	updatedAt: sqDateTime,
	status: z.enum(["pending", "done", "deleted"]),
	title: z.string(),
});

export const serializedTodos = z.array(serializedTodo);
