import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewUser, users } from "../schema.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  const [result] = await db.delete(users);
  return result;
}

export async function getUserByName(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserByID(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}
