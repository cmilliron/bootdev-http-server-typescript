import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewUser, users } from "../schema.js";

type returnedUser = Omit<NewUser, "hashedPassword">;
export type UpdateUser = {
  userId: string;
  email: string;
  hashedPassword: string;
};

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
      isChirpyRed: users.isChirpyRed,
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

export async function updateLoginInfo(userInfo: UpdateUser) {
  const [user] = await db
    .update(users)
    .set({ email: userInfo.email, hashedPassword: userInfo.hashedPassword })
    .where(eq(users.id, userInfo.userId))
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      isChirpyRed: users.isChirpyRed,
    });
  return user;
}

export async function upgradeChirpyRedByUserId(userId: string) {
  const [user] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      isChirpyRed: users.isChirpyRed,
    });
  return user;
}
