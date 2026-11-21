import express, { type Express } from "express";
import helmet from "helmet";
import type { Env } from "./config/env";
import type { Controller } from "./controllers";
import { AppError, errorBody } from "./lib/errors";
import { corsAllowList, errorHandler, requestId, requestLog } from "./middleware";
import { createRouter, type Limiters } from "./routes";
import type { Logger } from "./services/types";

export type AppDeps = {
  env: Env;
  controller: Controller;
  limiters: Limiters;
  log: Logger;
  /** Resolves true if the database answers. Must never throw details to the client. */
  checkDb: () => Promise<boolean>;
  emailStatus: "configured" | "console" | "not_configured";
};

export function createApp({ env, controller, limiters, log, checkDb, emailStatus }: AppDeps): Express {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", env.TRUST_PROXY); // set TRUST_PROXY=1 behind one proxy/load balancer so rate limits see real client IPs

  app.use(requestId, requestLog(log));
  app.use(helmet());                       // HSTS, nosniff, frameguard, no-referrer-style defaults
  app.use(corsAllowList(env.CORS_ORIGINS));
  app.use(express.json({ limit: "10kb" })); // body size limit (docs/12)
  app.use(express.urlencoded({ extended: false, limit: "2kb" })); // for the one-click unsubscribe POST from mail apps

  app.get("/health", async (_req, res) => {
    const db = await Promise.race([checkDb().catch(() => false), new Promise<boolean>((r) => setTimeout(() => r(false), 2000))]);
    res.status(200).json({ ok: true, database: db ? "up" : "down", email: emailStatus }); // statuses only, never details or secrets
  });
  app.use("/v1", createRouter(controller, limiters, env.TOKEN_SECRET));

  app.use((_req, res) => { res.status(404).json(errorBody(new AppError("NOT_FOUND", "Not found."))); });
  app.use(errorHandler(log));
  return app;
}
