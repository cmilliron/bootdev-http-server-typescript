import { type Response, type Request, type NextFunction } from "express";
import { apiResponseForError, apiResponseWithJSON } from "./json.js";
import { validateChirp } from "../lib/utils/chirp_helpers.js";
import { NewChirp } from "../lib/db/schema.js";
import {
  createChirp,
  getAllChirps,
  getChirpById,
  deleteChirpById,
  getChirpsByUserId,
} from "../lib/db/queries/chirps.js";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./handler_middleware.js";
import { getBerrerToken, validateJWT } from "../lib/utils/auth.js";
import { config } from "../config.js";

export type ChirpsResponse = Chirp[];

type Chirp = {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  body: string;
};

export async function createChirpHandler(req: Request, res: Response) {
  type parameter = {
    body: string;
    // userId: string;
  };

  const { body }: parameter = req.body;
  const token = getBerrerToken(req);
  const tokenUserId = validateJWT(token, config.jwt.secret);
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
  type UserQuery = {
    authorId?: string;
    sort?: string;
  };

  const { authorId, sort } = req.query;
  let chirps: ChirpsResponse;
  if (authorId) {
    chirps = await getChirpsByUserId(authorId as string);
  } else {
    chirps = await getAllChirps();
  }

  if (sort === "desc") {
    chirps.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

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

export async function deleteChirpHandler(req: Request, res: Response) {
  // ValidateJWT
  const bearerToken = getBerrerToken(req);
  const userId = validateJWT(bearerToken, config.jwt.secret);

  if (!userId) {
    throw new UnauthorizedError("Token is bad");
  }

  const { chirpID } = req.params;

  const chirp = await getChirpById(chirpID);
  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpID} not found`);
  }

  if (chirp.userId !== userId) {
    throw new ForbiddenError("Forbidden text");
  }

  const deleted = await deleteChirpById(chirpID);

  if (!deleted) {
    throw new NotFoundError("Tweet not found");
  }

  apiResponseWithJSON(res, 204);
}
