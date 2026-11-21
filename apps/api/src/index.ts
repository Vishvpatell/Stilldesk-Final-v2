import { loadEnv, formatEnvProblems } from "./config/env";
import { createApp } from "./app";
import { createController } from "./controllers";
import { createLogger } from "./lib/logger";
import { prisma } from "./prisma/client";
import { createPrismaRepo } from "./prisma/repo";
import { createMailer } from "./services/email";
import { WaitlistService } from "./services/waitlist-service";
import { createLimiters } from "./routes";

// 1. Validate configuration FIRST, with a clear message that names variables (never values).
const result = loadEnv(process.env);
if (!result.ok) {
  console.error(formatEnvProblems(result.problems));
  process.exit(1);
}
const env = result.env;
const log = createLogger(env.isProduction ? "info" : "debug");

if (!env.emailConfigured) log.warn({}, "Email is NOT configured (RESEND_API_KEY / EMAIL_FROM). Sign-ups will answer 503 until it is.");
if (env.EMAIL_MODE === "console") log.warn({}, "EMAIL_MODE=console: emails are printed to this log, not sent. Development only.");

// 2. Wire everything together.
const mailer = createMailer(env, log);
const service = new WaitlistService(createPrismaRepo(prisma), mailer, { siteUrl: env.SITE_URL, apiUrl: env.apiUrl, tokenSecret: env.TOKEN_SECRET }, log);
const app = createApp({
  env, log, limiters: createLimiters(),
  controller: createController(service, { siteUrl: env.SITE_URL }),
  checkDb: async () => { await prisma.$runCommandRaw({ ping: 1 }); return true; },
  emailStatus: env.EMAIL_MODE === "console" ? "console" : env.emailConfigured ? "configured" : "not_configured",
});

const server = app.listen(env.PORT, () => log.info({ port: env.PORT, env: env.NODE_ENV }, "Stilldesk API listening"));

// 3. Shut down cleanly; never crash silently.
const shutdown = (signal: string) => {
  log.info({ signal }, "shutting down");
  server.close(() => void prisma.$disconnect().finally(() => process.exit(0)));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => log.error({ err: reason instanceof Error ? reason.name : "unknown" }, "unhandled rejection"));
