import type { MetadataRoute } from "next";
import { site } from "@/config/site.config";

// Public pages only. The thank-you, confirmation, survey and unsubscribe pages are deliberately left out.
const PAGES: [string, number][] = [["/", 1], ["/faq", 0.8], ["/feedback", 0.4], ["/privacy", 0.3], ["/terms", 0.3], ["/data", 0.3]];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(([path, priority]) => ({ url: `${site.url}${path === "/" ? "" : path}`, lastModified, priority }));
}
