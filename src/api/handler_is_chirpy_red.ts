import type { Request, Response } from "express";
import { upgradeChirpyRedByUserId } from "../lib/db/queries/users.js";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./handler_middleware.js";
import { apiResponseWithJSON } from "./json.js";
import { getPolkaKey } from "../lib/utils/auth.js";
import { config } from "../config.js";

export async function upgradeChirpyRedHandler(req: Request, res: Response) {
  type requestBody = {
    event: string;
    data: {
      userId: string;
    };
  };
  const { event, data }: requestBody = req.body;

  const apiKey = getPolkaKey(req);
  if (apiKey !== config.api.polkaKey) {
    throw new UnauthorizedError("User not authorized");
  }

  if (event !== "user.upgraded") {
    // console.log("Not user.upgraded");
    apiResponseWithJSON(res, 204);
    return;
  }

  const upgradedUser = await upgradeChirpyRedByUserId(data.userId);

  if (!upgradedUser) {
    throw new NotFoundError("User not found");
  }
  //   console.log("upgraded user: ", upgradedUser);
  apiResponseWithJSON(res, 204);
}
