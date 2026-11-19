import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Data and Privacy",
  description: "A plain-language list of the data Stilldesk stores, where it lives, how long it is kept, and how to export or delete it.",
  alternates: { canonical: "/data" },
};

export default function Page() {
  return <LegalPage file="10-data-and-privacy-summary.md" title="Data and Privacy" />;
}
