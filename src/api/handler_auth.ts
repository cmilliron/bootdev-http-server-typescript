import { type Response, type Request, type NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "./handler_middleware.js";
import { apiResponseWithJSON } from "./json.js";
import { NewUser } from "../lib/db/schema";
import { checkPasswordHash, hashPassword, makeJWT } from "../lib/utils/auth.js";
import {
  createUser,
  getUserByEmail,
  getUserByID,
} from "../lib/db/queries/users.js";
import { config } from "src/config.js";

export async function userLoginHandler(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
    expiresInSeconds: number;
  };
  let { email, password, expiresInSeconds }: parameter = req.body;
  if (!email) {
    throw new BadRequestError("Email not provided");
  }
  if (!password) {
    throw new BadRequestError("Password not provided");
  }
  const { hashedPassword, ...returnedUser } = await getUserByEmail(email);
  if (!expiresInSeconds || expiresInSeconds > 60 * 60) {
    expiresInSeconds = 60 * 60;
  }
  ``;
  if (await checkPasswordHash(password, hashedPassword)) {
    const token = makeJWT(returnedUser.id, expiresInSeconds, config.secret);
    apiResponseWithJSON(res, 200, { ...returnedUser, token });
  } else {
    throw new UnauthorizedError("Please check your username or password");
  }
}
