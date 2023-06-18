import { join } from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
	serverRuntimeConfig: {
		db: join(process.cwd(), "todo.db"),
	},
};

export default nextConfig;
