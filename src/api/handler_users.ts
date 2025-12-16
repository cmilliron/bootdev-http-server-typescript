import { type Response, type Request, type NextFunction } from "express";
import {
  createUser,
  getUserByEmail,
  getUserByID,
  UpdateUser,
} from "../lib/db/queries/users.js";
import { apiResponseWithJSON } from "./json.js";
import { BadRequestError, UnauthorizedError } from "./handler_middleware.js";
import { NewUser } from "../lib/db/schema";
import {
  checkPasswordHash,
  hashPassword,
  validateJWT,
  getBerrerToken,
} from "../lib/utils/auth.js";
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashedPassword">;

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

export async function userUpdateLoginHandler(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  };
  // ValidateJWT
  const bearerToken = getBerrerToken(req);

  if (!bearerToken) {
    throw new UnauthorizedError("In valid JWT");
  }

  const userId = validateJWT(bearerToken, config.jwt.secret);

  if (!userId) {
    throw new UnauthorizedError("Invalid JWT");
  }

  // Validate Parameters
  let { email, password }: parameter = req.body;
  if (!email || !password) {
    throw new BadRequestError("Missing Required Field");
  }

  // Update User
  const hashedPassword = await hashPassword(password);
  const updatedUser: UpdateUser = {
    userId,
    email,
    hashedPassword,
  };
  const returnedUser = apiResponseWithJSON(res, 200, updatedUser);
}
