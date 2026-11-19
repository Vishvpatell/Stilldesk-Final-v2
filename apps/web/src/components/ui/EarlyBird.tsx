import { isUnresolved, value } from "@/config/site.config";

/**
 * "an early-bird offer" now, "an early-bird offer (<details>)" once EARLY_BIRD_OFFER is filled in.
 * This keeps unfinished {{TOKENS}} off the public page while the offer is still undecided.
 */
export function EarlyBird({ lower = true }: { lower?: boolean }) {
  const t = lower ? "an early-bird offer" : "An early-bird offer";
  return <>{isUnresolved("EARLY_BIRD_OFFER") ? t : `${t} (${value("EARLY_BIRD_OFFER")})`}</>;
}
