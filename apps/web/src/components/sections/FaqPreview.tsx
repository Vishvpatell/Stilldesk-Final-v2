import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Markdown } from "@/lib/markdown";
import { FAQ_HOME_ORDER, parseFaq } from "@/lib/content";

/** Home FAQ: the 8 questions chosen in docs/03 section 14, answers straight from docs/04. */
export function FaqPreview() {
  const all = parseFaq().flatMap((g) => g.items);
  const items = FAQ_HOME_ORDER.map((q) => all.find((x) => x.q === q)).filter(Boolean).map((x) => ({ q: x!.q, a: <Markdown source={x!.a} startLevel={4} /> }));
  return (
    <section className="fq" id="faq" aria-labelledby="fq-h">
      <div className="fq-wrap">
        <p className="eyebrow">Questions</p>
        <h2 id="fq-h" className="sec-h">Answered plainly.</h2>
        <Accordion items={items} />
        <p className="fq-more"><Link className="link" href="/faq">See all questions</Link></p>
      </div>
    </section>
  );
}
