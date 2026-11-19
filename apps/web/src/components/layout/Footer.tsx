import Link from "next/link";
import { isUnresolved, site, value } from "@/config/site.config";

// Columns and wording from docs/02-sitemap-and-page-specs.md. /feedback is not linked until its API exists (Stage 5).
const cols = [
  { title: "Product", links: [
    ["How it works", "/#loop"], ["Features", "/#features"], ["Study together", "/#together"],
    ["Free vs Pro", "/#plans"], ["Join the waitlist", "/#waitlist"] ] },
  { title: "Company", links: [
    ["Why Stilldesk", "/#problem"], ["Help and FAQ", "/faq"] ] },
  { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["Data and Privacy", "/data"]] },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="cols">
        <div>
          <Link className="brand" href="/"><span className="mark" aria-hidden="true" />Stilldesk</Link>
          <p className="tag">{site.tagline}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h3>{c.title}</h3>
            <ul>
              {c.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}
              {c.title === "Company" && !isUnresolved("SUPPORT_EMAIL") && <li><a href={`mailto:${value("SUPPORT_EMAIL")}`}>Contact support</a></li>}
            </ul>
          </div>
        ))}
      </div>
      <div className="base">
        <p className="made">Made for people who have something to study.</p>
        <p>Stilldesk. Plan it. Sit down. Study. · Launching soon on Android. · © {site.year} Stilldesk. All rights reserved.</p>
        <p>Product and app names such as Instagram and YouTube belong to their owners. Stilldesk is not affiliated with them. We name them only as examples of apps you might choose to block.</p>
      </div>
    </footer>
  );
}
