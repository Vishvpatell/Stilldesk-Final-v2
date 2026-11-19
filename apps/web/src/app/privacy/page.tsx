import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Stilldesk collects, uses and protects your data on this website and waitlist. No ads, no selling your data.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalPage file="08-privacy-policy.md" title="Privacy Policy" />;
}
