import argon2 from "argon2";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../api/handler_middleware.js";
import type { Request } from "express";

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

  const jwtResponse = jwt.sign(payload, secret);
  return jwtResponse;
}

export function validateJWT(tokenString: string, secret: string): string {
  const verifyToken = jwt.verify(tokenString, secret);
  if (!verifyToken.sub) {
    throw new UnauthorizedError("User not authorized");
  }
  return verifyToken.sub as string;
}

export function getBerrerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("User not authorized1");
  }
  const token = authHeader.slice(8);
  return token;
}
