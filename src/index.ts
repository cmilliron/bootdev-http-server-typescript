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
import { handlerAdminDisplayMetrics } from "./api/handlers_admin.js";
import { handerValidateChirp } from "./api/handler_validate_chirp.js";

const app = express();
const PORT = 8080;

// app.use(express.static("."));
app.use(middlewareLogResponse);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handerValidateChirp);
// app.get("/api/metrics", handlerDisplayMetrics);

app.post("/admin/reset", handlerResetMetrics);
app.get("/admin/metrics", handlerAdminDisplayMetrics);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
