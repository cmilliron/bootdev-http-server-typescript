import { BadRequestError } from "../../api/handler_middleware.js";

export function validateChirp(body: string) {
  if (!body) {
    throw new BadRequestError("Invaid JSON");
  }
  if (body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }
  const cleanedBody = removeProfane(body);
  return cleanedBody;
}

function removeProfane(chirp: string) {
  const BADWORDS = ["kerfuffle", "sharbert", "fornax"];

  const profaneWords = BADWORDS;

  const cleanedChirp = chirp.split(" ").map((word) => {
    if (profaneWords.includes(word.toLowerCase())) {
      return "****";
    }
    return word;
  });
  return cleanedChirp.join(" ");
}
