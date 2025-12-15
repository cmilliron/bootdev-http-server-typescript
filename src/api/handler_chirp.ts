import { type Response, type Request, type NextFunction } from "express";
import { apiResponseForError, apiResponseWithJSON } from "./json.js";
import { validateChirp } from "../lib/utils/chirp_helpers.js";
import { NewChirp } from "../lib/db/schema.js";
import {
  createChirp,
  getAllChirps,
  getChirpById,
} from "../lib/db/queries/chirps.js";
import { get } from "http";
import { NotFoundError, UnauthorizedError } from "./handler_middleware.js";
import { getBerrerToken, validateJWT } from "../lib/utils/auth.js";
import { config } from "../config.js";

export async function createChirpHandler(req: Request, res: Response) {
  type parameter = {
    body: string;
    // userId: string;
  };

  const { body }: parameter = req.body;
  const token = getBerrerToken(req);
  const tokenUserId = validateJWT(token, config.secret);
  // console.log("userID: ", userId);
  console.log("token: ", tokenUserId);
  if (
    !tokenUserId
    // tokenUserId !== userId
  ) {
    throw new UnauthorizedError("Token does not match user");
  }

  const cleanedBody = validateChirp(body);

  const newChirp: NewChirp = {
    body: cleanedBody,
    userId: tokenUserId,
  };
  const createdChirp = await createChirp(newChirp);
  apiResponseWithJSON(res, 201, createdChirp);
}

export async function getAllChirpsHandler(req: Request, res: Response) {
  const chirps = await getAllChirps();
  apiResponseWithJSON(res, 200, chirps);
}

export async function getChirpHandler(req: Request, res: Response) {
  const { chirpID } = req.params;
  const chirp = await getChirpById(chirpID);
  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }
  // console.log("In chirp handers");
  apiResponseWithJSON(res, 200, chirp);
}
