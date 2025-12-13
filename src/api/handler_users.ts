import { type Response, type Request, type NextFunction } from "express";
import { createUser } from "../lib/db/queries/users.js";
import { apiResponseWithJSON } from "./json.js";
import { BadRequestError } from "./handler_middleware.js";
import { NewUser } from "../lib/db/schema";

export async function createUserHandler(req: Request, res: Response) {
  type parameter = {
    email: string;
  };
  const param: parameter = req.body;
  if (!param.email) {
    throw new BadRequestError("Email not provided");
  }

  const newUser: NewUser = { email: param.email };
  const response = await createUser(newUser);
  apiResponseWithJSON(res, 201, { ...response });
}
