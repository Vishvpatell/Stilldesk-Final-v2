import { isUnresolved, value } from "@/config/site.config";

/** The support address as a mailto link once it is configured. Until then: neutral wording, no raw token on the page. */
export function SupportEmail({ fallback = "our support email" }: { fallback?: string }) {
  return isUnresolved("SUPPORT_EMAIL") ? <>{fallback}</> : <a href={`mailto:${value("SUPPORT_EMAIL")}`}>{value("SUPPORT_EMAIL")}</a>;
}
