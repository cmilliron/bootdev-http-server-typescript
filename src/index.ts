import express from "express";
import { handlerReadiness } from "./api/handler_readiness.js";
import { middlewareLogResponse } from "./middleware-log-response.js";

const app = express();
const PORT = 8080;

// app.use(express.static("."));
app.use(middlewareLogResponse);
app.use("/app", express.static("./src/app"));
app.get("/healthz", handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
