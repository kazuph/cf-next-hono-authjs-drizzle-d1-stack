import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";

import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { zValidator } from "@hono/zod-validator";

import {
	todos,
	createTodoSchema,
	updateToggleTodoSchema,
	deleteTodoSchema,
	updateTodoJsonSchema,
	updateTodoParamSchema,
} from "@/app/schema";
import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getAuthConfig } from "@/lib/auth";

export const runtime = "edge";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use(csrf());
app.use(secureHeaders());
// app.use("*", async (c, next) => {
// 	const userAgent = c.req.header("User-Agent");
// 	if (!userAgent || !userAgent.includes("Mozilla")) {
// 		return c.text("Access denied", 403);
// 	}
// 	await next();
// });

app.use("*", initAuthConfig(getAuthConfig));
app.use("/auth/*", authHandler());
app.use("/*", verifyAuth());

const route = app
	.get("/todos", async (c) => {
		const authUser = c.get("authUser");
		if (!authUser) return c.json({ error: "Unauthorized" }, 401);
		if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

		const db = getDb();
		const results = await db
			.select()
			.from(todos)
			.where(eq(todos.userId, authUser.user.id))
			.all();
		return c.json(results);
	})
	.post("/todos", zValidator("json", createTodoSchema), async (c) => {
		const authUser = c.get("authUser");
		if (!authUser) return c.json({ error: "Unauthorized" }, 401);
		if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

		const db = getDb();
		const { description } = c.req.valid("json");
		const result = await db
			.insert(todos)
			.values({ description, userId: authUser.user.id })
			.returning();
		return c.json(result[0]);
	})
	.put(
		"/todos/:id/toggle",
		zValidator("param", updateTodoParamSchema),
		zValidator("json", updateToggleTodoSchema),
		async (c) => {
			const authUser = c.get("authUser");
			if (!authUser) return c.json({ error: "Unauthorized" }, 401);
			if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

			const db = getDb();
			const { id } = c.req.valid("param");
			const { completed } = c.req.valid("json");
			const result = await db
				.update(todos)
				.set({ completed })
				.where(and(eq(todos.id, id), eq(todos.userId, authUser.user.id)))
				.returning();

			if (result.length === 0)
				return c.json({ error: "Todo not found or not owned by user" }, 404);
			return c.json(result[0]);
		},
	)
	.put(
		"/todos/:id",
		zValidator("param", updateTodoParamSchema),
		zValidator("json", updateTodoJsonSchema),
		async (c) => {
			const authUser = c.get("authUser");
			if (!authUser) return c.json({ error: "Unauthorized" }, 401);
			if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

			const db = getDb();
			const { id } = c.req.valid("param");
			const { description } = c.req.valid("json");
			const result = await db
				.update(todos)
				.set({ description })
				.where(and(eq(todos.id, id), eq(todos.userId, authUser.user.id)))
				.returning();

			if (result.length === 0)
				return c.json({ error: "Todo not found or not owned by user" }, 404);
			return c.json(result[0]);
		},
	)
	.delete("/todos/:id", zValidator("param", deleteTodoSchema), async (c) => {
		const authUser = c.get("authUser");
		if (!authUser) return c.json({ error: "Unauthorized" }, 401);
		if (!authUser.user) return c.json({ error: "Invalid user" }, 400);

		const db = getDb();
		const { id } = c.req.valid("param");
		const result = await db
			.delete(todos)
			.where(and(eq(todos.id, id), eq(todos.userId, authUser.user.id)))
			.returning();

		if (result.length === 0)
			return c.json({ error: "Todo not found or not owned by user" }, 404);
		return c.json({ success: true });
	});

export const GET = handle(route);
export const POST = handle(route);
export const PUT = handle(route);
export const DELETE = handle(route);

export type AppType = typeof route;
