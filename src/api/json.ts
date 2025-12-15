import type { Response } from "express";

export function apiResponseForError(
  res: Response,
  code: number,
  message: string
) {
  apiResponseWithJSON(res, code, { error: message });
}

export function apiResponseWithJSON(
  res: Response,
  code: number,
  payload?: any
) {
  res.set("Content-Type", "application/json");
  // console.log(payload);
  const body = payload ? JSON.stringify(payload) : null;
  res.status(code).send(body);
}
