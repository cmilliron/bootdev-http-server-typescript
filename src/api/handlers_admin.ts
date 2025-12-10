import { type Response, type Request } from "express";
import { config } from "../config.js";

export function handlerAdminDisplayMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

// export function handlerResetMetrics(req: Request, res: Response) {
//   config.fileserverHits = 0;
//   res.set("Content-Type", "text/plain; charset=utf-8");
//   res.send(`Hits reset. Hits ${config.fileserverHits}`);
// }
