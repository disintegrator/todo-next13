import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Tag = {
	id: Generated<number>;
	todoId: number;
	createdAt: Generated<string>;
	updatedAt: Generated<string>;
	label: string;
};
export type Todo = {
	id: Generated<number>;
	createdAt: Generated<string>;
	updatedAt: Generated<string>;
	status: string;
	title: string;
};
export type DB = {
	Tag: Tag;
	Todo: Todo;
};
