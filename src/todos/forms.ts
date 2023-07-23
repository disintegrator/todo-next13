import { z } from "zod";

export const createTodoForm = z.object({
	title: z.string().trim().min(1),
	status: z.enum(["pending", "done"]).default("pending"),
});

export type CreateTodoForm = z.infer<typeof createTodoForm>;

export const updateTodoForm = createTodoForm
	.partial()
	.extend({
		id: z.coerce.number().int().positive(),
	})
	.refine(({ title, status }) => title || status, {
		message: "At least one field needs to be changed",
	});

export type UpdateTodoForm = z.infer<typeof updateTodoForm>;
