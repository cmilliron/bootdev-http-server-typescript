import { type Response, type Request } from "express";

type ChirpBodyResponse = {
  body: string;
};

type ErrorResponseBody = {
  error: string;
};

export function handerValidateChirp(req: Request, res: Response) {
  let body = "";

  // 2. Listen for data events
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    res.set("Content-Type", "application/json");
    try {
      const parsedBody: ChirpBodyResponse = JSON.parse(body);
      if (!parsedBody.body) {
        throw new Error("Something went wrong");
      }
      if (parsedBody.body.length > 140) {
        throw new Error("Chirp is too long");
      }
      res.status(200).send(
        JSON.stringify({
          valid: true,
        })
      );
    } catch (error) {
      let responseBody: ErrorResponseBody = {
        error: "",
      };
      if (error instanceof Error) {
        responseBody.error = error.message;
      } else {
        responseBody.error = error as string;
      }
      res.status(400).send(JSON.stringify(responseBody));
    }
  });
}
