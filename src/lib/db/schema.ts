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
  ...timestamps,
});

export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  body: varchar("body", { length: 140 }).notNull(),
  ...timestamps,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export type NewChirp = typeof chirps.$inferInsert;
