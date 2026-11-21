export function buildSecurityHeaders(opts?: { apiOrigin?: string; isDev?: boolean }): { key: string; value: string }[];
export function checkSiteUrl(raw: string | undefined, opts: { production: boolean }): string | null;
