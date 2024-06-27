// drizzle.config.ts

import { defineConfig } from "drizzle-kit";
import fs from "node:fs";
import path from "node:path";

function getLocalD1DB() {
	const basePath = path.resolve(".wrangler");
	const dbFile = fs
		.readdirSync(basePath, { encoding: "utf-8", recursive: true })
		.find((f) => f.endsWith(".sqlite"));

	if (!dbFile) {
		throw new Error(`.sqlite file not found in ${basePath}`);
	}

	const url = path.resolve(basePath, dbFile);
	return url;
}

export default defineConfig({
	dialect: "sqlite",
	schema: "./app/schema.ts",
	out: "./drizzle/migrations",
	...(process.env.NODE_ENV === "production"
		? {
				driver: "d1-http",
				dbCredentials: {
					databaseId: "3d18d93c-40cc-4257-8014-07be49c91ec3",
					accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
					token: process.env.CLOUDFLARE_D1_API_TOKEN,
				},
			}
		: {
				dbCredentials: {
					url: getLocalD1DB(),
				},
			}),
});
