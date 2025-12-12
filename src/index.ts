import express from "express";
import { handlerReadiness } from "./api/handler_readiness.js";
import {
  middlewareLogResponse,
  middlewareMetricsInc,
} from "./api/middleware.js";
import {
  handlerDisplayMetrics,
  handlerResetMetrics,
} from "./api/handlers_metrics.js";
import { createUserHandler } from "./api/handler_users.js";
import {
  adminResetHandler,
  handlerAdminDisplayMetrics,
} from "./api/handlers_admin.js";
import { validateChirpHandler } from "./api/handler_chirp.js";
import { errorHandler } from "./api/handler_middleware.js";
import { config } from "./config.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

// Make sure DB has latest migrationsi
const migrationClient = postgres(config.db.dbURL, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// console.log("dburl: ", config.dbURL);

const app = express();
const PORT = 8080;

// app.use(express.static("."));
app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", validateChirpHandler);
app.post("/api/users", createUserHandler);
// app.get("/api/metrics", handlerDisplayMetrics);

app.post("/admin/reset", adminResetHandler);
app.get("/admin/metrics", handlerAdminDisplayMetrics);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
