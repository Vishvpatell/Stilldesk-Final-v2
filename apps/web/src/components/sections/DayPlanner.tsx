"use client";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useScrub } from "@/hooks/useScrub";
import {
  DAY_END, DAY_START, INITIAL_BLOCKS, SNAP, TASKS, addTask, fmtShort, fmtSpoken, fmtTime, moveBlock, removeBlock, resizeBlock, type Block,
} from "@/lib/planner";

/**
 * Day planner: put each task into a time block ("from this time to that time I will do this"). An illustrative, working example.
 * Mouse: drag a block to move it, drag its bottom edge to change its length. Touch, keyboard and screen readers: select a block and use
 * the buttons, or the arrow keys. As you scroll, a thin "now" line moves down the day and lights the block it passes (it reverses too).
 */
const TOTAL = DAY_END - DAY_START;
const HOURS = Array.from({ length: TOTAL / 60 + 1 }, (_, i) => DAY_START + i * 60);
const pct = (m: number) => ((m - DAY_START) / TOTAL) * 100;
const clamp = (x: number) => Math.max(0, Math.min(1, x));
type Drag = { id: string; mode: "move" | "resize"; y0: number; start0: number; end0: number };

export function DayPlanner() {
  const section = useRef<HTMLElement>(null);
  const lane = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [sel, setSel] = useState<string | null>(null);
  const [say, setSay] = useState("");
  const [now, setNow] = useState<number | null>(null);

  useScrub(section, {
    mode: "pass",
    onUpdate: (p) => { const m = DAY_START + Math.round((clamp((p - 0.25) / 0.5) * TOTAL) / SNAP) * SNAP; setNow((prev) => (prev === m ? prev : m)); },
  });

  const selected = blocks.find((b) => b.id === sel) ?? null;
  const apply = (next: Block[], id: string, what: string) => {
    const b = next.find((x) => x.id === id);
    if (next === blocks || !b) { setSay(`${what}: not possible, that time is taken or outside the day.`); return; }
    setBlocks(next); setSay(`${b.title} now ${fmtSpoken(b)}.`);
  };
  const act = (id: string, kind: "earlier" | "later" | "shorter" | "longer") => {
    const b = blocks.find((x) => x.id === id);
    if (!b) return;
    if (kind === "earlier") apply(moveBlock(blocks, id, b.start - SNAP), id, "Move earlier");
    if (kind === "later") apply(moveBlock(blocks, id, b.start + SNAP), id, "Move later");
    if (kind === "shorter") apply(resizeBlock(blocks, id, b.end - SNAP), id, "Make shorter");
    if (kind === "longer") apply(resizeBlock(blocks, id, b.end + SNAP), id, "Make longer");
  };
  const remove = (id: string) => { const b = blocks.find((x) => x.id === id); setBlocks(removeBlock(blocks, id)); setSel(null); setSay(`${b?.title ?? "Block"} removed from your day.`); };

  // ---- mouse / pen dragging (touch uses the buttons, so the page can still scroll) ----
  const startDrag = (e: PointerEvent<HTMLElement>, b: Block, mode: Drag["mode"]) => {
    if (e.pointerType === "touch") return;
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: b.id, mode, y0: e.clientY, start0: b.start, end0: b.end };
    setSel(b.id);
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current, h = lane.current?.getBoundingClientRect().height;
    if (!d || !h) return;
    const dm = ((e.clientY - d.y0) / h) * TOTAL;
    setBlocks((bs) => (d.mode === "move" ? moveBlock(bs, d.id, d.start0 + dm) : resizeBlock(bs, d.id, d.end0 + dm)));
  };
  const endDrag = () => {
    const d = drag.current; drag.current = null;
    const b = d && blocks.find((x) => x.id === d.id);
    if (b) setSay(`${b.title} now ${fmtSpoken(b)}.`);
  };

  const onKey = (e: KeyboardEvent<HTMLElement>, b: Block) => {
    const k = e.key, dir = k === "ArrowUp" ? "earlier" : k === "ArrowDown" ? "later" : null;
    if (dir) { e.preventDefault(); act(b.id, e.shiftKey ? (dir === "earlier" ? "shorter" : "longer") : dir); }
    else if (k === "Delete" || k === "Backspace") { e.preventDefault(); remove(b.id); }
    else if (k === "Enter" || k === " ") { e.preventDefault(); setSel(sel === b.id ? null : b.id); }
  };

  const add = (t: (typeof TASKS)[number]) => {
    const next = addTask(blocks, t);
    if (!next) { setSay("Your day is full. Make a block shorter or remove one first."); return; }
    setBlocks(next); setSel(t.id);
    const b = next.find((x) => x.id === t.id);
    if (b) setSay(`${t.title} added, ${fmtSpoken(b)}.`);
  };

  return (
    <section className="plan" id="planner" ref={section} aria-labelledby="plan-h">
      <div className="plan-wrap">
        <p className="eyebrow rv">Plan your day</p>
        <h2 id="plan-h" className="sec-h rv d1">Give every task a time.</h2>
        <p className="lead rv d2">Drop each task into your day, from this time to that time. Move things as plans change.</p>
        <p className="plan-chips rv d2"><span className="chip now">In the free plan</span><span className="chip now">At launch</span></p>

        <div className="pl-stage rv">
          <aside className="pl-side" aria-label="Tasks waiting for a time">
            <p className="bd-k">Waiting for a time</p>
            <ul>
              {TASKS.map((t) => {
                const placed = blocks.some((b) => b.id === t.id);
                return (
                  <li key={t.id}>
                    <span className="pl-t"><b>{t.title}</b><small>about {t.len} min</small></span>
                    <button className="btn ghost sm" disabled={placed} onClick={() => add(t)} aria-label={placed ? `${t.title} is in your day` : `Add ${t.title} to my day`}>{placed ? "In your day" : "Add to my day"}</button>
                  </li>
                );
              })}
            </ul>
            <p className="pl-hint">Drag a block to move it. Drag its bottom edge to change its length. Or select it and use the buttons below.</p>
            <button className="btn ghost sm" onClick={() => { setBlocks(INITIAL_BLOCKS); setSel(null); setSay("Example reset."); }}>Reset the example</button>
          </aside>

          <div className="pl-cal" role="group" aria-label="Example day, 4 PM to 10 PM">
            <div className="pl-lane" ref={lane}>
              {HOURS.map((m) => (<div className="pl-hr" key={m} style={{ top: `${pct(m)}%` }}><span>{fmtTime(m).replace(":00", "")}</span></div>))}
              {now !== null && (<div className="pl-now" style={{ top: `${pct(now)}%` }} aria-hidden="true"><span>{fmtTime(now)}</span></div>)}
              {blocks.map((b, i) => {
                const live = now !== null && b.start <= now && now < b.end;
                return (
                  <div key={b.id} role="button" tabIndex={0} aria-pressed={sel === b.id} data-short={b.end - b.start <= 30 || undefined}
                    aria-label={`${b.title}, ${fmtSpoken(b)}. Enter selects. Arrow keys move it, Shift plus arrow keys change its length, Delete removes it.`}
                    className={`pb t-${b.tone}${sel === b.id ? " sel" : ""}${live ? " live" : ""}`}
                    style={{ top: `${pct(b.start)}%`, height: `${pct(b.end) - pct(b.start)}%`, ["--i" as string]: i }}
                    onClick={() => setSel(sel === b.id ? null : b.id)} onKeyDown={(e) => onKey(e, b)}
                    onPointerDown={(e) => startDrag(e, b, "move")} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag}>
                    <span className="pb-t">{b.title}</span><span className="pb-r">{fmtShort(b)}</span>
                    <span className="pb-h" aria-hidden="true" onPointerDown={(e) => startDrag(e, b, "resize")} onPointerMove={onMove} onPointerUp={endDrag} onPointerCancel={endDrag} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pl-bar" role="group" aria-label="Change the selected block">
          {selected ? (
            <>
              <p><b>{selected.title}</b> · {fmtShort(selected)}</p>
              <div>
                <button className="btn ghost sm" onClick={() => act(selected.id, "earlier")}>Earlier</button>
                <button className="btn ghost sm" onClick={() => act(selected.id, "later")}>Later</button>
                <button className="btn ghost sm" onClick={() => act(selected.id, "shorter")}>Shorter</button>
                <button className="btn ghost sm" onClick={() => act(selected.id, "longer")}>Longer</button>
                <button className="btn ghost sm" onClick={() => remove(selected.id)}>Remove</button>
              </div>
            </>
          ) : <p className="pl-hint">Select a block to move it, change its length or remove it.</p>}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{say}</p>
        <p className="bd-cap rv"><em>An example of the idea, not a real screenshot. Times are yours to change.</em></p>
      </div>
    </section>
  );
}
