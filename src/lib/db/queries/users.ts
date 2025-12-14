import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewUser, users } from "../schema.js";

type returnedUser = Omit<NewUser, "hashedPassword">;

export async function createUser(user: NewUser) {
  const result: returnedUser[] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    });
  return result[0];
}

export async function deleteAllUsers() {
  const [result] = await db.delete(users);
  return result;
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function getUserByID(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}
