import { NextResponse } from "next/server";
import { createTodoForm } from "@/todos/forms";
import { db } from "@/db/client";
import { serializedTodo, serializedTodos } from "@/todos/serializers";
import { TodosClient } from "@/todos/repository";
import { revalidate } from "@/lib/caching";

const todosClient = new TodosClient(db);

export async function GET() {
	const result = await todosClient.findAll();

	return NextResponse.json(
		{ todos: serializedTodos.parse(result) },
		{ status: 200 },
	);
}

export async function POST(request: Request) {
	const body = await request.json();
	const parsed = createTodoForm.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ errors: parsed.error }, { status: 422 });
	}

	const result = await todosClient.create(parsed.data);

	revalidate.todos();

	return NextResponse.json(
		{ todo: serializedTodo.parse(result) },
		{ status: 201 },
	);
}
