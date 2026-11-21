import pino from "pino";
import type { Logger } from "../services/types";

/** Structured logs. Rule (docs/12): ids and error names only. Never emails, names, message text, tokens or IPs. */
export const createLogger = (level: string): Logger & pino.Logger => pino({ level, base: { service: "stilldesk-api" }, redact: ["req.headers", "*.email", "*.token", "*.message"] });
