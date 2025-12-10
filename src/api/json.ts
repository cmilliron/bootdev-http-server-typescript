import type { Response } from "express";

export function apiResponseForError(
  res: Response,
  code: number,
  message: string
) {
  apiResponseWithJSON(res, code, { error: message });
}

export function apiResponseWithJSON(res: Response, code: number, payload: any) {
  res.set("Content-Type", "application/json");
  const body = JSON.stringify(payload);
  res.status(code).send(body);
}
