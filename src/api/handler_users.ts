import { type Response, type Request, type NextFunction } from "express";
import {
  createUser,
  getUserByEmail,
  getUserByID,
} from "../lib/db/queries/users.js";
import { apiResponseWithJSON } from "./json.js";
import { BadRequestError, UnauthorizedError } from "./handler_middleware.js";
import { NewUser } from "../lib/db/schema";
import { checkPasswordHash, hashPassword } from "../lib/utils/auth.js";

export async function createUserHandler(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  };
  let { email, password }: parameter = req.body;
  if (!email) {
    throw new BadRequestError("Email not provided");
  }
  if (!password) {
    throw new BadRequestError("Password not provided");
  }

  const hashedPassword = await hashPassword(password);
  const newUser: NewUser = { email, hashedPassword };
  const response = await createUser(newUser);
  apiResponseWithJSON(res, 201, { ...response });
}
