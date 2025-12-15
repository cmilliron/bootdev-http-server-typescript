import argon2 from "argon2";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../api/handler_middleware.js";
import type { Request } from "express";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
}

export async function checkPasswordHash(
  password: string,
  hash: string
): Promise<boolean> {
  if (await argon2.verify(hash, password)) {
    return true;
  } else {
    return false;
  }
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(
  userID: string,
  expiresIn: number,
  secret: string
): string {
  const issueDate = Math.floor(Date.now() / 1000);

  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: issueDate,
    exp: issueDate + expiresIn,
  };

  const jwtResponse = jwt.sign(payload, secret, { algorithm: "HS256" });
  return jwtResponse;
}

export function validateJWT(tokenString: string, secret: string): string {
  let verifyToken: Payload;

  try {
    verifyToken = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (verifyToken.iss !== "chirpy") {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!verifyToken.sub) {
    throw new UnauthorizedError("No User ID");
  }

  return verifyToken.sub as string;
}

export function getBerrerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  console.log(authHeader);
  if (!authHeader) {
    throw new UnauthorizedError("User not authorized");
  }
  const token = authHeader.slice(7);
  console.log(token);
  return token;
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function isRefreshTokenExpired(expiresAt: Date): boolean {
  return expiresAt.getTime() < Date.now();
}
