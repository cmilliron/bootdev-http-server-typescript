import { type Request, type Response, type NextFunction } from "express";
import { apiResponseForError } from "./json.js";

// Erro
// r Types
export class BadRequestError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
  }
}

export class UnauthorizedError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class PaymentRequiredError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "PaymentRequiredError";
    this.status = 402;
  }
}

export class ForbiddenError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.status = 403;
  }
}

export class NotFoundError extends Error {
  status: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err);
  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof PaymentRequiredError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError
  ) {
    apiResponseForError(res, err.status, err.message);
  } else {
    apiResponseForError(res, 500, "Something went wrong on our end");
  }
}
