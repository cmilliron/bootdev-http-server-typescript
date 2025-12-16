import { type Response, type Request } from "express";
import { config } from "../config.js";

export function handlerDisplayMetrics(req: Request, res: Response) {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits: ${config.api.fileserverHits}`);
}

export function handlerResetMetrics(req: Request, res: Response) {
  config.api.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(`Hits reset. Hits ${config.api.fileserverHits}`);
}
