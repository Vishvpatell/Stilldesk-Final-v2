import { createHmac } from "node:crypto";

export type LimitResult = { allowed: boolean; remaining: number; retryAfterSec: number };
type Options = { limit: number; windowMs: number; maxKeys?: number; now?: () => number };

/**
 * Fixed-window counter held in memory (per API instance). Keys are HMAC-hashed, so raw IP addresses are never stored.
 * Memory is bounded (maxKeys). With several API instances, move counters to Redis (docs/12 allows either).
 */
export class RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly maxKeys: number;
  private readonly now: () => number;

  constructor(opts: Options) {
    this.limit = opts.limit;
    this.windowMs = opts.windowMs;
    this.maxKeys = opts.maxKeys ?? 20_000;
    this.now = opts.now ?? Date.now;
  }

  hit(key: string): LimitResult {
    const now = this.now();
    let e = this.hits.get(key);
    if (!e || e.resetAt <= now) {
      if (this.hits.size >= this.maxKeys) this.prune(now);
      e = { count: 0, resetAt: now + this.windowMs };
      this.hits.set(key, e);
    }
    e.count += 1;
    const retryAfterSec = Math.max(1, Math.ceil((e.resetAt - now) / 1000));
    return { allowed: e.count <= this.limit, remaining: Math.max(0, this.limit - e.count), retryAfterSec };
  }

  private prune(now: number) {
    for (const [k, v] of this.hits) if (v.resetAt <= now) this.hits.delete(k);
    while (this.hits.size >= this.maxKeys) {
      const oldest = this.hits.keys().next().value;
      if (oldest === undefined) break;
      this.hits.delete(oldest);
    }
  }
}

/** Anonymise an IP for use as a limiter key. */
export const ipKey = (ip: string | undefined, secret: string): string => createHmac("sha256", secret).update(ip ?? "unknown").digest("hex").slice(0, 32);
