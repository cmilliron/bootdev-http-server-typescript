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
import {
  createUserHandler,
  userUpdateLoginHandler,
} from "./api/handler_users.js";
import {
  refreshTokenHandler,
  revokeTokenHandler,
  userLoginHandler,
} from "./api/handler_auth.js";
import {
  adminResetHandler,
  handlerAdminDisplayMetrics,
} from "./api/handlers_admin.js";
import {
  createChirpHandler,
  deleteChirpHandler,
  getAllChirpsHandler,
  getChirpHandler,
} from "./api/handler_chirp.js";
// import { validateChirpHandler } from "./api/handler_chirp.js";
import { errorHandler } from "./api/handler_middleware.js";
import { config } from "./config.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { getChirpById } from "./lib/db/queries/chirps.js";

// Make sure DB has latest migrationsi
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

// console.log("dburl: ", config.dbURL);

const app = express();
const PORT = 8080;

// app.use(express.static("."));
app.use(express.json());
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) =>
  Promise.resolve(handlerReadiness(req, res)).catch(next)
);
app.post("/api/users", (req, res, next) =>
  Promise.resolve(createUserHandler(req, res)).catch(next)
);
app.put("/api/users", (req, res, next) =>
  Promise.resolve(userUpdateLoginHandler(req, res)).catch(next)
);
app.post("/api/login", (req, res, next) =>
  Promise.resolve(userLoginHandler(req, res)).catch(next)
);

app.get("/api/chirps", (req, res, next) =>
  Promise.resolve(getAllChirpsHandler(req, res)).catch(next)
);
app.get("/api/chirps/:chirpID", (req, res, next) =>
  Promise.resolve(getChirpHandler(req, res)).catch(next)
);
app.delete("/api/chirps/:chirpID", (req, res, next) =>
  Promise.resolve(deleteChirpHandler(req, res)).catch(next)
);

app.post("/api/chirps", (req, res, next) =>
  Promise.resolve(createChirpHandler(req, res)).catch(next)
);
app.post("/api/refresh", (req, res, next) =>
  Promise.resolve(refreshTokenHandler(req, res)).catch(next)
);
app.post("/api/revoke", (req, res, next) =>
  Promise.resolve(revokeTokenHandler(req, res)).catch(next)
);
// app.post("/api/validate_chirp", validateChirpHandler);
// app.get("/api/metrics", handlerDisplayMetrics);

app.post("/admin/reset", (req, res, next) =>
  Promise.resolve(adminResetHandler(req, res)).catch(next)
);
app.get("/admin/metrics", (req, res, next) =>
  Promise.resolve(handlerAdminDisplayMetrics(req, res)).catch(next)
);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
