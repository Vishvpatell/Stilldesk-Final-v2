/**
 * Monitoring and analytics INTEGRATION POINTS. Everything here is OFF until the owner approves a provider.
 * Nothing loads, no cookies are set, no third-party script is added. To enable later, set NEXT_PUBLIC_ANALYTICS_PROVIDER
 * and add the provider's snippet inside the marked function. If a provider sets cookies or tracks across sites, add a consent banner (docs/05 H).
 */
export const analyticsProvider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER ?? ""; // "" = disabled

/** Called when a page crashes (src/app/error.tsx). Hook an error-monitoring service in here (e.g. Sentry). Disabled for now. */
export async function reportError(error: Error): Promise<void> {
  if (!process.env.NEXT_PUBLIC_ERROR_MONITORING) return;
  // Example for later: (await import("@sentry/nextjs")).captureException(error);
  void error;
}

/** Privacy-friendly event tracking hook. A no-op while analytics is disabled. */
export function track(event: string): void {
  if (!analyticsProvider) return;
  void event;
}
