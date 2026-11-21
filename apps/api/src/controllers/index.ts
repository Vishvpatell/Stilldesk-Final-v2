import type { ZodTypeAny, z } from "zod";
import { AppError, errorBody } from "../lib/errors";
import { feedbackBody, fieldErrors, surveyBody, waitlistBody } from "../schemas";
import type { WaitlistService } from "../services/waitlist-service";

/** What a controller returns. The Express layer just writes this to the response. */
export type HttpResult = { status: number; body?: unknown; redirect?: string };

function parse<S extends ZodTypeAny>(schema: S, raw: unknown): z.infer<S> {
  const r = schema.safeParse(raw ?? {});
  if (!r.success) throw new AppError("VALIDATION_ERROR", "Please check the highlighted fields.", fieldErrors(r.error));
  return r.data;
}
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export function createController(service: WaitlistService, cfg: { siteUrl: string }) {
  const run = async (fn: () => Promise<HttpResult>): Promise<HttpResult> => {
    try { return await fn(); }
    catch (e) {
      if (e instanceof AppError) return { status: e.status, body: errorBody(e) };
      throw e; // unknown errors go to the central handler (generic 500, nothing leaked)
    }
  };
  const ok = (body: unknown): HttpResult => ({ status: 200, body });

  return {
    join: (raw: unknown) => run(async () => ok(await service.join(parse(waitlistBody, raw)))),

    confirm: (query: { token?: unknown }) => run(async () => {
      const r = await service.confirm(str(query.token));
      const url = `${cfg.siteUrl}/waitlist/confirmed?status=${r.status}${r.status === "ok" ? `&survey=${encodeURIComponent(r.surveyToken)}` : ""}`;
      return { status: 302, redirect: url };
    }),

    survey: (raw: unknown) => run(async () => {
      const b = parse(surveyBody, raw);
      return ok(await service.saveSurvey(b.token, b.answers));
    }),

    /** Token may come in the JSON body or the query string (the email "one-click unsubscribe" header posts to a URL with ?token=). */
    unsubscribe: (body: { token?: unknown } | undefined, query: { token?: unknown }) => run(async () => ok(await service.unsubscribe(str(body?.token) ?? str(query.token)))),

    feedback: (raw: unknown) => run(async () => ok(await service.feedback(parse(feedbackBody, raw)))),
  };
}
export type Controller = ReturnType<typeof createController>;
