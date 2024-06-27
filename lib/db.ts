import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";

export const runtime = "edge";

export const getDb = () => {
	const d1 = getRequestContext().env.DB;
	return drizzle(d1);
};
