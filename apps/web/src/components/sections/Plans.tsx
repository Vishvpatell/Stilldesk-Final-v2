"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EarlyBird } from "@/components/ui/EarlyBird";
import { Placeholder } from "@/components/ui/Placeholder";
import { planGroups, pricing, whyChoose } from "@/config/pricing.config";
import { value } from "@/config/site.config";

// Copy: docs/03 section 11 (table, intro, footnote) and docs/04 (FAQ answers). No price is shown (docs/02).
const FAQ = [
  { q: "Is Stilldesk free?", a: "The core promise is free: capture, the arrival prompt, study sessions and basic blocking. Pro is an optional upgrade with extras such as unlimited AI brain-dumps, unlimited blocked apps, full charts, exam mode and sync. Pro launches after the free app is stable." },
  { q: "How much will Pro cost?", a: "The price is not set yet. We are asking the waitlist what would feel fair for students, so we can price it sensibly. People on the waitlist get an early-bird offer and a 7-day Pro trial." },
  { q: "What is the early-bird offer?", a: <><EarlyBird lower={false} />. The exact terms are in the Terms of Service and in your confirmation email.</> },
  { q: "Will there be ads?", a: "No. Stilldesk has no ads. It is paid for by Pro." },
  { q: "Can I cancel Pro, or get a refund?", a: <>Pro is not on sale yet, so there is nothing to cancel today. <Placeholder token="PRO_CANCELLATION_TERMS" /></> },
];

const Check = () => (<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>);

function Cell({ v, pro, meter }: { v: string; pro?: boolean; meter?: boolean }) {
  return (
    <td className={pro ? "pro" : "free"}>
      {v === "Yes" ? <span className="yes"><Check /><span className="sr-only">Yes</span></span> : <span>{v}</span>}
      {meter && (
        <span className="pips" aria-hidden="true">
          {Array.from({ length: pro ? 18 : 10 }).map((_, i) => <i key={i} style={{ ["--k" as string]: i, ["--n" as string]: pro ? 18 : 10 }} />)}
        </span>
      )}
    </td>
  );
}

export function Plans() {
  const ref = useRef<HTMLElement>(null);
  useScrub(ref, { mode: "pass" });
  return (
    <section className="plans" id="plans" ref={ref} aria-labelledby="plans-h">
      <div className="plans-wrap">
        <p className="eyebrow rv">Free vs Pro</p>
        <h2 id="plans-h" className="sec-h rv d1">The core promise stays free</h2>
        <p className="lead rv d2 plans-intro">Capture, the arrival prompt, study sessions and basic blocking are free for good. Pro adds extras for people who want more. Pro launches after the free app is stable.</p>

        <div className="pcards">
          <article className="pcard free rv">
            <p className="pk">Free</p>
            <h3>The core promise, free for good.</h3>
            <ul>
              <li>Brain-dump bar, 10 a day</li><li>Arrival prompt</li><li>Stopwatch, timer, deep work</li><li>Blocking for a few apps</li><li>Streaks and basic stats</li>
            </ul>
            <ButtonLink href="/#waitlist" variant="ghost">Join the waitlist</ButtonLink>
          </article>
          <article className="pcard pro rv d1">
            <span className="chip">{pricing.proStatus}</span>
            <p className="pk">Pro</p>
            <h3>Everything in Free, plus more room.</h3>
            <ul>
              <li>Unlimited brain-dumps</li><li>Unlimited blocked apps, optional strict mode</li><li>Full colour charts and best focus time</li><li>Exam mode</li><li>Sync across devices</li>
            </ul>
            <ButtonLink href="/#waitlist"><span className="sheen">Get early access to Pro</span></ButtonLink>
            <p className="pnote">{pricing.priceLine}</p>
          </article>
        </div>

        <h3 className="cmp-h rv">Everything, side by side</h3>
        <div className="cmp-wrap rv">
          <div className="pro-spot" aria-hidden="true" />
          <table className="cmp">
            <caption className="sr-only">Free and Pro compared, feature by feature</caption>
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Feature</span></th>
                <th scope="col"><span className="plan-pill">Free</span></th>
                <th scope="col"><span className="plan-pill pro">Pro</span> <span className="chip">{pricing.proStatus}</span></th>
              </tr>
            </thead>
            {planGroups.map((g) => (
              <tbody key={g.title}>
                <tr className="grp"><th colSpan={3} scope="colgroup">{g.title}</th></tr>
                {g.rows.map((r) => (
                  <tr key={r.label} className={r.same ? "same" : "diff"}>
                    <th scope="row">{r.label}</th>
                    <Cell v={r.free} meter={r.meter} />
                    <Cell v={r.pro} pro meter={r.meter} />
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>

        <div className="why">
          <div className="rv"><p className="why-k">Free is enough if…</p><p>{whyChoose.free}</p></div>
          <div className="rv d1"><p className="why-k">Pro is for…</p><p>{whyChoose.pro}</p></div>
        </div>

        <div className="price-card rv">
          <div>
            {pricing.showPrices
              ? <p className="pp-line">Pro: {value("PRO_PRICE_MONTHLY")} a month, or {value("PRO_PRICE_YEARLY")} a year.</p>
              : <p className="pp-line">{pricing.priceLine}</p>}
            <p className="pp-sub">{pricing.trialLine} {pricing.footnote}</p>
          </div>
          <ButtonLink href="/#waitlist"><span className="sheen">Join the waitlist</span></ButtonLink>
        </div>

        <div className="plans-faq">
          <h3 className="rv">Questions about Free and Pro</h3>
          <Accordion items={FAQ} />
        </div>
      </div>
    </section>
  );
}
