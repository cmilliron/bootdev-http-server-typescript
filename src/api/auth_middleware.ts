import { getBerrerToken, validateJWT } from "src/lib/utils/auth";
import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "./handler_middleware";
import { config } from "../config.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const bearerToken = getBerrerToken(req);

  if (!bearerToken) {
    throw new UnauthorizedError("In valid JWT");
  }

  const userId = validateJWT(bearerToken, config.jwt.secret);

  if (!userId) {
    throw new UnauthorizedError("Invalid JWT");
  }
}
