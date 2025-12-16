import { type Response, type Request, type NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "./handler_middleware.js";
import { apiResponseForError, apiResponseWithJSON } from "./json.js";
import { NewUser, refreshTokens } from "../lib/db/schema";
import {
  checkPasswordHash,
  getBerrerToken,
  hashPassword,
  isRefreshTokenExpired,
  makeJWT,
  makeRefreshToken,
} from "../lib/utils/auth.js";
import {
  createUser,
  getUserByEmail,
  getUserByID,
} from "../lib/db/queries/users.js";
import { config } from "../config.js";
import {
  saveRefreshToken,
  getRefeshToken,
  setTokenAsRevoked,
} from "../lib/db/queries/auth.js";
import { UserResponse } from "./handler_users.js";

type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

export async function userLoginHandler(req: Request, res: Response) {
  type parameter = {
    email: string;
    password: string;
  };
  let { email, password }: parameter = req.body;
  if (!email) {
    throw new BadRequestError("Email not provided");
  }
  if (!password) {
    throw new BadRequestError("Password not provided");
  }
  const { hashedPassword, ...returnedUser } = await getUserByEmail(email);

  const matching = await checkPasswordHash(password, hashedPassword);

  if (!matching) {
    throw new UnauthorizedError("Please check your username or password");
  }

  const token = makeJWT(
    returnedUser.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  );
  const refreshToken = makeRefreshToken();
  const refreshTokenResponse = await saveRefreshToken(
    returnedUser.id,
    refreshToken
  );

  if (!refreshTokenResponse) {
    throw new UnauthorizedError("Could not save Reresh token");
  }

  apiResponseWithJSON(res, 200, {
    ...returnedUser,
    token,
    refreshToken: refreshTokenResponse.token,
  });
}

export async function refreshTokenHandler(req: Request, res: Response) {
  const bearerToken = getBerrerToken(req);

  if (!bearerToken) {
    throw new UnauthorizedError("No Bearer Token");
  }

  const refreshToken = await getRefeshToken(bearerToken);
  console.info("Refresh Token: \n", refreshToken);

  if (isRefreshTokenExpired(refreshToken.expires_at)) {
    throw new UnauthorizedError("Token has expired");
  }
  if (refreshToken.revoked_at) {
    throw new UnauthorizedError("Token was revoked");
  }

  const jwtToken = makeJWT(
    refreshToken.userId,
    config.jwt.defaultDuration,
    config.jwt.secret
  );

  apiResponseWithJSON(res, 200, { token: jwtToken });
}

export async function revokeTokenHandler(req: Request, res: Response) {
  const bearerToken = getBerrerToken(req);

  if (!bearerToken) {
    throw new UnauthorizedError("No Bearer Token");
  }

  const revokedToken = await setTokenAsRevoked(bearerToken);

  console.error("revoked token: ", revokedToken);

  apiResponseWithJSON(res, 204);
}
