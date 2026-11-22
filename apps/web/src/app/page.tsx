import { Hero } from "@/components/hero/Hero";
import { Problem } from "@/components/sections/Problem";
import { Spark } from "@/components/sections/Spark";
import { Loop } from "@/components/sections/Loop";
import { Day } from "@/components/sections/Day";
import { BrainDump } from "@/components/sections/BrainDump";
import { DayPlanner } from "@/components/sections/DayPlanner";
import { Features } from "@/components/sections/Features";
import { Blocking } from "@/components/sections/Blocking";
import { LampStates } from "@/components/sections/LampStates";
import { Promises } from "@/components/sections/Promises";
import { Together } from "@/components/sections/Together";
import { ProPreview } from "@/components/sections/ProPreview";
import { Plans } from "@/components/sections/Plans";
import { PrivacySummary } from "@/components/sections/PrivacySummary";
import { Roadmap } from "@/components/sections/Roadmap";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { Waitlist } from "@/components/sections/Waitlist";
import { Thread } from "@/components/ui/Thread";
import type { Metadata } from "next";
import { JsonLd } from "@/lib/jsonld";
import { site } from "@/config/site.config";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const structuredData = [
  { "@context": "https://schema.org", "@type": "Organization", name: site.name, url: site.url, logo: `${site.url}/apple-icon.png` },
  { "@context": "https://schema.org", "@type": "WebSite", name: site.name, url: site.url },
  { "@context": "https://schema.org", "@type": "SoftwareApplication", name: site.name, applicationCategory: "EducationalApplication", operatingSystem: "Android", url: site.url,
    description: "A calm study app for college students: capture plans in class, get them back at your desk, and block distractions only while you study." },
];

// The story: the problem, how Stilldesk fixes it, what is in it, what it costs, why you can trust it, then the waitlist.
export default function Home() {
  return (
    <>
      <JsonLd data={structuredData} />
      <Hero />
      <Problem />
      <Spark />
      <Thread />
      <Loop />
      <Thread height="18vh" />
      <Day />
      <BrainDump />
      <DayPlanner />
      <Features />
      <Blocking />
      <LampStates />
      <Promises />
      <Together />
      <ProPreview />
      <Plans />
      <PrivacySummary />
      <Roadmap />
      <FaqPreview />
      <Waitlist />
    </>
  );
}
