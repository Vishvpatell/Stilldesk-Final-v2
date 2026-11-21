import { randomUUID } from "node:crypto";
import cors from "cors";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError, errorBody } from "../lib/errors";
import { ipKey, type RateLimiter } from "../lib/rate-limit";
import type { Logger } from "../services/types";

/** CORS allow-list = the website origin(s) only. Requests without an Origin header (email links, curl) are not browsers cross-site, so they pass. */
export const corsAllowList = (origins: string[]) =>
  cors({
    origin: (origin, cb) => cb(null, !origin || origins.includes(origin)),
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  });

export const requestId: RequestHandler = (req, res, next) => {
  const id = randomUUID();
  res.locals.requestId = id;
  res.setHeader("X-Request-Id", id);
  next();
};

/** One log line per request: method, path WITHOUT the query string (it can contain tokens), status, duration. */
export const requestLog = (log: Logger): RequestHandler => (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => log.info({ id: res.locals.requestId, method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - start }, "request"));
  next();
};

export const rateLimit = (limiter: RateLimiter, secret: string): RequestHandler => (req, res, next) => {
  const r = limiter.hit(ipKey(req.ip, secret));
  if (!r.allowed) {
    res.setHeader("Retry-After", String(r.retryAfterSec));
    res.status(429).json(errorBody(new AppError("RATE_LIMITED", "Too many requests from this connection. Please try again later.")));
    return;
  }
  next();
};

/** Central error handler: clients only ever see our own safe messages, never stack traces or internals. */
export const errorHandler = (log: Logger): ErrorRequestHandler => (err, _req, res, next) => {
  if (res.headersSent) return next(err);
  const type = (err as { type?: string }).type;
  if (type === "entity.too.large") return void res.status(413).json(errorBody(new AppError("VALIDATION_ERROR", "That request is too large.")));
  if (type === "entity.parse.failed" || err instanceof SyntaxError) return void res.status(400).json(errorBody(new AppError("VALIDATION_ERROR", "That request couldn't be read.")));
  if (err instanceof AppError) return void res.status(err.status).json(errorBody(err));
  log.error({ id: res.locals.requestId, err: err instanceof Error ? err.name : "unknown" }, "unhandled error");
  res.status(500).json(errorBody(new AppError("INTERNAL", "Something went wrong on our side. Please try again.")));
};
