import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, refreshTokens } from "../schema.js";

export async function saveRefreshToken(userId: string, refreshToken: string) {
  const newRefreshToken: RefreshToken = {
    token: refreshToken,
    userId,
  };
  const [newToken] = await db
    .insert(refreshTokens)
    .values(newRefreshToken)
    .returning();
  return newToken;
}

export async function getRefeshToken(token: string) {
  const [refreshToken] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return refreshToken;
}

export async function getRefeshTokenByUserId(token: string) {
  const [refreshToken] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));
  return refreshToken;
}

export async function setTokenAsRevoked(token: string) {
  const [result] = await db
    .update(refreshTokens)
    .set({ revoked_at: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning();
  return result;
}
