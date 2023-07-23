import { db } from "@/db/client";
import { updateTodoForm } from "@/todos/forms";
import { TodosClient } from "@/todos/repository";
import { serializedTodo } from "@/todos/serializers";
import { NextResponse } from "next/server";

const todosClient = new TodosClient(db);

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const body = await request.json();

	const form = updateTodoForm.safeParse({ ...body, id: params.id });
	if (!form.success) {
		return NextResponse.json({ errors: form.error }, { status: 422 });
	}

	const result = await todosClient.updateById(form.data.id, form.data);

	return NextResponse.json({
		todo: serializedTodo.parse(result),
	});
}
