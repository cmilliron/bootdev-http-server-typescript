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
  createRefreshToken,
  getRefeshToken,
  setTokenAsRevoked,
} from "../lib/db/queries/auth.js";

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
  const expiresInSeconds = 60 * 60;

  if (await checkPasswordHash(password, hashedPassword)) {
    const token = makeJWT(returnedUser.id, expiresInSeconds, config.secret);
    const refreshToken = makeRefreshToken();
    const refreshTokenResponse = await createRefreshToken(
      returnedUser.id,
      refreshToken
    );
    // console.log(token);
    apiResponseWithJSON(res, 200, {
      ...returnedUser,
      token,
      refreshToken: refreshTokenResponse.token,
    });
  } else {
    throw new UnauthorizedError("Please check your username or password");
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  const bearerToken = getBerrerToken(req);

  if (!bearerToken) {
    throw new UnauthorizedError("No Bearer Token");
  }

  const refreshToken = await getRefeshToken(bearerToken);
  console.info("Refresh Token: \n", refreshToken);

  if (
    !isRefreshTokenExpired(refreshToken.expires_at) ||
    refreshToken.revoked_at
  ) {
    throw new UnauthorizedError("Token has expired");
  }

  apiResponseWithJSON(res, 200, { token: refreshToken.token });
}

export async function revokeTokenHandler(req: Request, res: Response) {
  const bearerToken = getBerrerToken(req);

  if (!bearerToken) {
    throw new UnauthorizedError("No Bearer Token");
  }

  const revokedToken = await setTokenAsRevoked(bearerToken);

  // if (!revokedToken) {
  //   apiResponseForError(res, 500, "Something went wrong");
  // }

  console.error("revoked token: ", revokedToken);

  apiResponseWithJSON(res, 204);
}
