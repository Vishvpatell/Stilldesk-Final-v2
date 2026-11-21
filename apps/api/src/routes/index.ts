import { Router, type Request, type RequestHandler, type Response } from "express";
import type { Controller, HttpResult } from "../controllers";
import { rateLimit } from "../middleware";
import { RateLimiter } from "../lib/rate-limit";

const HOUR = 3_600_000;
export type Limiters = Record<"join" | "confirm" | "survey" | "unsubscribe" | "feedback", RateLimiter>;

/** Per-endpoint limits suggested in docs/12. */
export const createLimiters = (): Limiters => ({
  join: new RateLimiter({ limit: 5, windowMs: HOUR }),
  confirm: new RateLimiter({ limit: 20, windowMs: HOUR }),
  survey: new RateLimiter({ limit: 10, windowMs: HOUR }),
  unsubscribe: new RateLimiter({ limit: 20, windowMs: HOUR }),
  feedback: new RateLimiter({ limit: 5, windowMs: HOUR }),
});

const send = (res: Response, r: HttpResult) => (r.redirect ? res.redirect(r.status, r.redirect) : res.status(r.status).json(r.body));
/** Express 4 does not catch async errors by itself: forward them to the central handler. */
const wrap = (fn: (req: Request, res: Response) => Promise<void>): RequestHandler => (req, res, next) => { fn(req, res).catch(next); };

export function createRouter(ctl: Controller, limiters: Limiters, secret: string): Router {
  const r = Router();
  r.post("/waitlist", rateLimit(limiters.join, secret), wrap(async (req, res) => { send(res, await ctl.join(req.body)); }));
  r.get("/waitlist/confirm", rateLimit(limiters.confirm, secret), wrap(async (req, res) => { send(res, await ctl.confirm(req.query)); }));
  r.post("/waitlist/survey", rateLimit(limiters.survey, secret), wrap(async (req, res) => { send(res, await ctl.survey(req.body)); }));
  r.post("/waitlist/unsubscribe", rateLimit(limiters.unsubscribe, secret), wrap(async (req, res) => { send(res, await ctl.unsubscribe(req.body, req.query)); }));
  r.post("/feedback", rateLimit(limiters.feedback, secret), wrap(async (req, res) => { send(res, await ctl.feedback(req.body)); }));
  return r;
}
