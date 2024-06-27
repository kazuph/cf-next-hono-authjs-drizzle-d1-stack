import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
	image: text("image"),
});

export const accounts = sqliteTable("account", {
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	type: text("type").$type<"oauth" | "oidc" | "email">().notNull(),
	provider: text("provider").notNull(),
	providerAccountId: text("providerAccountId").notNull(),
	refresh_token: text("refresh_token"),
	access_token: text("access_token"),
	expires_at: integer("expires_at"),
	token_type: text("token_type"),
	scope: text("scope"),
	id_token: text("id_token"),
	session_state: text("session_state"),
});

export const sessions = sqliteTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable("verificationToken", {
	identifier: text("identifier").notNull(),
	token: text("token").notNull(),
	expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const todos = sqliteTable("todos", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	description: text("description").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	completed: integer("completed", { mode: "boolean" }).default(false),
	createdAt: integer("created_at", { mode: "timestamp" }).default(
		sql`(strftime('%s', 'now'))`,
	),
});

export const insertTodoSchema = createInsertSchema(todos).extend({
	description: z
		.string()
		.min(1, "Description is required")
		.min(3, "Description must be at least 3 characters")
		.max(100, "Description must be 100 characters or less"),
});
export const selectTodoSchema = createSelectSchema(todos);

// export const createTodoSchema = insertTodoSchema.omit({
// 	id: true,
// 	createdAt: true,
// });
export const createTodoSchema = z.object({
	description: z
		.string()
		.min(1, "Description is required")
		.min(3, "Description must be at least 3 characters")
		.max(100, "Description must be 100 characters or less"),
});

export const updateToggleTodoSchema = z.object({
	id: z.coerce.number(),
	completed: z.boolean(),
});

export const updateTodoParamSchema = z.object({
	id: z.coerce.number(),
});

export const updateTodoJsonSchema = z.object({
	description: z.string().min(1),
});

export const deleteTodoSchema = z.object({
	id: z.coerce.number(),
});
