import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password", { length: 256 })
    .notNull()
    .default("unset"),
  ...timestamps,
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: varchar("body", { length: 140 }).notNull(),
  ...timestamps,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type NewChirp = typeof chirps.$inferInsert;

export const refreshTokens = pgTable("refresh_tokens", {
  token: varchar("token", { length: 256 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at")
    .notNull()
    .defaultNow()
    .$default(() => new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)),
  revoked_at: timestamp("revoked_at"),
  ...timestamps,
});

export type RefreshToken = typeof refreshTokens.$inferInsert;
