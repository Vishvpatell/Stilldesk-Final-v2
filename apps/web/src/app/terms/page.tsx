import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of the Stilldesk website and waitlist, including the early-bird offer.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalPage file="09-terms-of-service.md" title="Terms of Service" />;
}
