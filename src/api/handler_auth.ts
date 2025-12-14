import { type Response, type Request, type NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "./handler_middleware.js";
import { apiResponseWithJSON } from "./json.js";
import { NewUser } from "../lib/db/schema";
import { checkPasswordHash, hashPassword } from "../lib/utils/auth.js";
import {
  createUser,
  getUserByEmail,
  getUserByID,
} from "../lib/db/queries/users.js";

export async function userLoginHandler(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  };
  const { email, password }: parameter = req.body;
  if (!email) {
    throw new BadRequestError("Email not provided");
  }
  if (!password) {
    throw new BadRequestError("Password not provided");
  }
  const { hashedPassword, ...returnedUser } = await getUserByEmail(email);
  if (await checkPasswordHash(password, hashedPassword)) {
    apiResponseWithJSON(res, 200, returnedUser);
  } else {
    throw new UnauthorizedError("Please check your username or password");
  }
}
