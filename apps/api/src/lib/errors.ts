export type ErrorCode = "VALIDATION_ERROR" | "RATE_LIMITED" | "NOT_FOUND" | "TOKEN_EXPIRED" | "TOKEN_INVALID" | "UNAVAILABLE" | "INTERNAL";

const STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400, RATE_LIMITED: 429, NOT_FOUND: 404, TOKEN_EXPIRED: 410, TOKEN_INVALID: 400, UNAVAILABLE: 503, INTERNAL: 500,
};

/** An error we chose to show to the client. Its message is always safe to send. */
export class AppError extends Error {
  readonly status: number;
  constructor(readonly code: ErrorCode, message: string, readonly fields?: Record<string, string>) {
    super(message);
    this.name = "AppError";
    this.status = STATUS[code];
  }
}

/** The error body format from docs/12. */
export const errorBody = (e: AppError) => ({ error: { code: e.code, message: e.message, ...(e.fields ? { fields: e.fields } : {}) } });
