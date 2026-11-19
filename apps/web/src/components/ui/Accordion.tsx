"use client";
import { useId, useState, type ReactNode } from "react";

export type AccordionItem = { q: string; a: ReactNode };

/** Accessible accordion: real buttons, aria-expanded, smooth height. All answers stay in the page source. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const base = useId();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="acc">
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div className={`acc-item${on ? " on" : ""}`} key={it.q}>
            <h3>
              <button aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? null : i)}>
                <span>{it.q}</span><i aria-hidden="true" />
              </button>
            </h3>
            <div className="acc-panel" id={`${base}-${i}`} role="region">
              <div><div className="acc-body">{it.a}</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
