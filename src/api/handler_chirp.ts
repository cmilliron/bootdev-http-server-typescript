import { type Response, type Request, type NextFunction } from "express";
import { apiResponseForError, apiResponseWithJSON } from "./json.js";
import { BadRequestError } from "./handler_middleware.js";

type parameter = {
  body: string;
};

const BADWORDS = ["kerfuffle", "sharbert", "fornax"];

export async function validateChirpHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const parsedBody: parameter = req.body;
  try {
    if (!parsedBody.body) {
      throw new BadRequestError("Invaid JSON");
    }
    if (parsedBody.body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const cleanedBody = removeProfane(parsedBody.body);
    apiResponseWithJSON(res, 200, { valid: true, cleanedBody });
  } catch (error) {
    // if (error instanceof Error) {
    //   apiResponseForError(res, 400, error.message);
    //   return;
    // }
    // apiResponseForError(res, 400, "Something went wrong");
    next(error);
  }
}

function removeProfane(chirp: string) {
  const profaneWords = BADWORDS;
  const cleanedChirp = chirp.split(" ").map((word) => {
    if (profaneWords.includes(word.toLowerCase())) {
      return "****";
    }
    return word;
  });
  return cleanedChirp.join(" ");
}
