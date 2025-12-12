import { type Response, type Request } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "./handler_middleware.js";
import { deleteAllUsers } from "../lib/db/queries/users.js";
import { NewUser } from "src/lib/db/schema.js";
import { apiResponseWithJSON } from "./json.js";

export function handlerAdminDisplayMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

export async function adminResetHandler(req: Request, res: Response) {
  if (config.platform !== "dev") {
    throw new ForbiddenError("You do not have permission");
  }
  config.fileserverHits = 0;
  // const results: NewUser[] =
  await deleteAllUsers();
  // console.log(results)
  // const payload = results.map((item) => item.email);
  apiResponseWithJSON(res, 200, { status: "OK", message: "Database is reset" });
}
