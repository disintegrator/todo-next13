#!/usr/bin/env node

import fs from "node:fs";
import process from "node:process";
import path from "node:path";

const templatePath = path.join(process.cwd(), "prisma", "todo.db.template");
const dbPath = path.join(process.cwd(), "todo.db");

(function () {
	if (fs.existsSync(dbPath)) {
		return;
	}

	console.log("Copying template database...");
	fs.copyFileSync(templatePath, dbPath);
	console.log("Database created at:", dbPath);
})();
