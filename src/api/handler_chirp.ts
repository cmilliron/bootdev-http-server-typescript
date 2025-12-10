import { type Response, type Request } from "express";
import { apiResponseForError, apiResponseWithJSON } from "./json";

type parameter = {
  body: string;
};

export async function handerValidateChirp(req: Request, res: Response) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const parsedBody: parameter = JSON.parse(body);
      if (!parsedBody.body) {
        throw new Error("Invaid JSON");
      }
      if (parsedBody.body.length > 140) {
        throw new Error("Chirp is too long");
      }
      apiResponseWithJSON(res, 200, { valid: true });
    } catch (error) {
      if (error instanceof Error) {
        apiResponseForError(res, 400, error.message);
      }
      apiResponseForError(res, 400, "Something went wrong");
    }
  });
}
