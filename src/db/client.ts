import path from "node:path";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

import { DB } from "./schema.generated"; // this is the Database interface we defined earlier

const dialect = new SqliteDialect({
	database: new SQLite(path.join(process.cwd(), "todo.db")),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
	dialect,
});

export type DBClient = typeof db;
