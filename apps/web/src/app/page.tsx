import { Hero } from "@/components/hero/Hero";
import { Problem } from "@/components/sections/Problem";
import { Loop } from "@/components/sections/Loop";
import { Day } from "@/components/sections/Day";
import { BrainDump } from "@/components/sections/BrainDump";
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

// The story: the problem, how Stilldesk fixes it, what is in it, what it costs, why you can trust it, then the waitlist.
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Thread />
      <Loop />
      <Thread height="18vh" />
      <Day />
      <BrainDump />
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
