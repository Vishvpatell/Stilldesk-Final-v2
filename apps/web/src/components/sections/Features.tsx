"use client";
import { useEffect, useRef, useState } from "react";
import { LampIcon, type LampState } from "@/components/ui/LampIcon";

// Cards: docs/03 section 6. Chips: At launch / After launch. Demos below are labelled examples, not screenshots.
const CARDS: [string, "At launch" | "After launch", string][] = [
  ["Brain-dump bar", "At launch", "One blank bar. Write anything. AI sorts it into tasks."],
  ["Subjects, with colours", "At launch", "Drag a task to another subject any time. Stilldesk learns from your corrections on your phone."],
  ["Day planner", "At launch", "Put each task into a time block, from this time to that time. Move it whenever plans change."],
  ["Today screen", "At launch", "Only today’s plan. Swipe “not today” to move a task to tomorrow with no penalty."],
  ["Arrival prompt", "At launch", "One notification when you reach your room, by Wi-Fi, location, a time, or a button. Location is optional."],
  ["Study sessions", "At launch", "Stopwatch by default, timers of 15, 25 or 45 minutes, and a 90-minute deep work mode."],
  ["Session-only blocking", "At launch", "Blocked only while a session runs. One tap to end it, plus a 5-minute emergency snooze."],
  ["Breaks and break tags", "At launch", "Tag a break Snack, Scroll, Chat, Rest or Other, or skip. Plan a 10-minute scroll break with no guilt."],
  ["Stats that stay kind", "At launch", "Today’s time, this week by subject, and your streak. Charts use colour and labels."],
  ["Forgiving streaks", "At launch", "A day counts at 20 minutes by default. One free freeze day a week. Miss days and you see “Welcome back.”"],
  ["Your own day reset", "At launch", "Your day ends at 4:00 AM by default, so late sessions are not split in two."],
  ["Quiet hours", "At launch", "Two notifications a day at most by default. Quiet hours 11 PM to 7 AM."],
  ["Dark by default", "At launch", "Dark mode, adjustable text size, a one-handed layout."],
  ["Study rooms", "After launch", "Private groups and public topic rooms. Lit windows, no chat, no rankings."],
  ["Habit tracker", "After launch", "Simple daily check boxes. No stopwatch, no pressure."],
  ["Exam mode (Pro)", "After launch", "Add an exam date and subjects. See a countdown and a suggested spread of topics."],
  ["Sync across devices (Pro)", "After launch", "Keep your plan on more than one phone."],
];

const TABS = ["Today", "Sessions", "Breaks", "Streaks"] as const;
type Tab = (typeof TABS)[number];

function Today() {
  const all = ["DBMS assignment", "Revise physics, ch. 3", "Buy notebook"];
  const [left, setLeft] = useState(all), [moved, setMoved] = useState(0);
  return (
    <div className="dm-today">
      <p className="u-k">Today</p>
      <ul>
        {left.map((t, i) => (<li key={t} className={i === 0 ? "first" : ""}><span>{t}</span>{i === 0 && <small>about 45 min</small>}</li>))}
        {!left.length && <li className="empty">Nothing left for today.</li>}
      </ul>
      <div className="dm-row">
        <button className="btn ghost sm" disabled={!left.length} onClick={() => { setLeft(left.slice(1)); setMoved(moved + 1); }}>Not today</button>
        <button className="btn ghost sm" onClick={() => { setLeft(all); setMoved(0); }}>Reset</button>
      </div>
      <p className="dm-note" aria-live="polite">{moved ? `Moved to tomorrow. No penalty. (${moved})` : "Swipe a task away: it moves to tomorrow."}</p>
    </div>
  );
}

function Sessions() {
  const modes = [["Stopwatch", 0], ["15 min", 900], ["25 min", 1500], ["45 min", 2700], ["Deep work 90", 5400]] as const;
  const [mode, setMode] = useState(0), [run, setRun] = useState<"idle" | "on" | "pause">("idle"), [sec, setSec] = useState(0);
  const dur = modes[mode][1];
  useEffect(() => {
    if (run !== "on") return;
    const id = setInterval(() => setSec((s) => (dur ? Math.max(0, s - 1) : s + 1)), 1000);
    return () => clearInterval(id);
  }, [run, dur]);
  useEffect(() => { setRun("idle"); setSec(dur); }, [dur]);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const state: LampState = run === "on" ? "studying" : run === "pause" ? "paused" : "break";
  const label = run === "on" ? "Studying" : run === "pause" ? "Paused" : "Ready";
  return (
    <div className="dm-sess">
      <div className="u-seg wide" role="radiogroup" aria-label="Session mode">
        {modes.map(([n], i) => (<button key={n} role="radio" aria-checked={mode === i} className={mode === i ? "sel" : ""} onClick={() => setMode(i)}>{n}</button>))}
      </div>
      <div className="dm-lamp"><LampIcon state={run === "idle" ? undefined : state} className={run === "idle" ? "dim" : ""} /></div>
      <p className="u-state">{label}</p>
      <p className="watch">{fmt(sec)}</p>
      <div className="dm-row">
        {run === "on" ? <button className="btn sm" onClick={() => setRun("pause")}>Pause</button> : <button className="btn sm" onClick={() => setRun("on")}>{run === "pause" ? "Resume" : "Start"}</button>}
        <button className="btn ghost sm" onClick={() => { setRun("idle"); setSec(dur); }}>End session</button>
      </div>
    </div>
  );
}

function Breaks() {
  const tags = ["Snack", "Scroll", "Chat", "Rest", "Other"];
  const [tag, setTag] = useState<string | null>(null);
  return (
    <div className="dm-brk">
      <p className="u-k">Break</p>
      <p className="u-big">Take a breath.</p>
      <div className="dm-chips" role="group" aria-label="Break tag">
        {tags.map((t) => (<button key={t} aria-pressed={tag === t} className={tag === t ? "on" : ""} onClick={() => setTag(tag === t ? null : t)}>{t}</button>))}
      </div>
      <p className="dm-note" aria-live="polite">{tag ? `Tagged “${tag}”. No guilt.` : "Tag it, or skip. Both are fine."}</p>
    </div>
  );
}

function Streaks() {
  const [freeze, setFreeze] = useState(false);
  const days = ["M", "T", "W", "T", "F", "S", "S"], st = ["done", "done", "miss", "done", "done", "done", "today"];
  return (
    <div className="dm-str">
      <p className="u-k">This week</p>
      <div className="dm-days">
        {days.map((d, i) => { const s = st[i] === "miss" && freeze ? "freeze" : st[i]; return <span key={i} className={s}><b>{d}</b><i>{s === "freeze" ? "Freeze" : s === "miss" ? "" : s === "done" ? "✓" : "·"}</i></span>; })}
      </div>
      <p className="u-big">{freeze ? "Streak kept." : "Welcome back."}</p>
      <button className="btn ghost sm" onClick={() => setFreeze(!freeze)} aria-pressed={freeze}>{freeze ? "Undo freeze day" : "Use the free freeze day"}</button>
      <p className="dm-note">Your best streak and total hours are always kept.</p>
    </div>
  );
}

export function Features() {
  const [tab, setTab] = useState<Tab>("Today");
  const ref = useRef<HTMLElement>(null);
  return (
    <section className="ft" id="features" ref={ref} aria-labelledby="ft-h">
      <div className="ft-wrap">
        <p className="eyebrow rv">Features</p>
        <h2 id="ft-h" className="sec-h rv d1">Everything you need to sit down and study</h2>
        <p className="lead rv d2">Small, calm tools. Each one does one job.</p>

        <div className="ft-demo rv">
          <div className="ft-tabs" role="tablist" aria-label="Try a feature">
            {TABS.map((t) => (<button key={t} role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="ft-panel" className={tab === t ? "on" : ""} onClick={() => setTab(t)}>{t}</button>))}
          </div>
          <div className="ft-panel" id="ft-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
            <div className="demo-card" key={tab}>
              {tab === "Today" && <Today />}{tab === "Sessions" && <Sessions />}{tab === "Breaks" && <Breaks />}{tab === "Streaks" && <Streaks />}
            </div>
            <p className="demo-tag">Try it. An example of the idea, not a real screenshot.</p>
          </div>
        </div>

        <ul className="ft-grid">
          {CARDS.map(([t, chip, text], i) => (
            <li className="fcard rv" key={t} style={{ transitionDelay: `${(i % 4) * 0.08}s` }} tabIndex={0}>
              <div className="fh"><h3>{t}</h3><span className={`chip${chip === "At launch" ? " now" : ""}`}>{chip}</span></div>
              <div className="fb"><p>{text}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
