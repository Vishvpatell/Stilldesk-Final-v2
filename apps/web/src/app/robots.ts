import type { MetadataRoute } from "next";
import { site } from "@/config/site.config";

// Private flow pages stay out of search results (they are also marked noindex on the page itself).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/waitlist/", "/unsubscribe"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
