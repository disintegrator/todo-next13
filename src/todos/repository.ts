import { DBClient } from "@/db/client";
import { Todo } from "@/db/schema.generated";
import { Insertable, Selectable, Updateable } from "kysely";

export interface TodosRepository {
	findAll(): Promise<Selectable<Todo>[]>;
	findById(id: number): Promise<Selectable<Todo> | undefined>;
	create(todo: Insertable<Todo>): Promise<Selectable<Todo>>;
	updateById(id: number, form: Updateable<Todo>): Promise<Selectable<Todo>>;
}

export class TodosClient implements TodosRepository {
	constructor(private db: DBClient) {}

	async findAll() {
		return this.db
			.selectFrom("Todo")
			.selectAll()
			.orderBy("createdAt", "desc")
			.execute();
	}

	async findById(id: number) {
		return this.db
			.selectFrom("Todo")
			.where("id", "=", id)
			.selectAll()
			.executeTakeFirst();
	}

	async create(todo: Insertable<Todo>) {
		return this.db
			.insertInto("Todo")
			.values(todo)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	async updateById(id: number, form: Updateable<Todo>) {
		return this.db
			.updateTable("Todo")
			.where("id", "=", id)
			.set(form)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}
