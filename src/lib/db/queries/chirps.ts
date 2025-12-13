import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewUser, users, NewChirp } from "../schema.js";

export async function createChirp(newChirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(newChirp)
    .onConflictDoNothing()
    .returning();
  //   console.log(result);
  return result;
}

export async function getAllChirps() {
  const results = await db.select().from(chirps).orderBy(chirps.createdAt);
  return results;
}

export async function getChirpById(chirpID: string) {
  const chirp = await db.select().from(chirps).where(eq(chirps.id, chirpID));
  return chirp[0];
}
