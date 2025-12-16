import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "../index.js";
import { RefreshToken, refreshTokens, users } from "../schema.js";
import { config } from "../../../config.js";

export async function saveRefreshToken(userId: string, refreshToken: string) {
  const newRefreshToken: RefreshToken = {
    token: refreshToken,
    userId,
    expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
    revokedAt: null,
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
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refreshTokens, eq(users.id, refreshTokens.userId))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date())
      )
    )
    .limit(1);

  return result;
}

export async function setTokenAsRevoked(token: string) {
  const rows = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, token))
    .returning();

  if (rows.length === 0) {
    throw new Error("Couldn't revoke token");
  }

  return rows[0];
}
