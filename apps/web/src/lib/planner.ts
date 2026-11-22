/**
 * Day planner logic: pure functions, no React. A day is a list of time blocks ("from this time to that time I will do this").
 * Times are minutes since midnight. Blocks snap to 15 minutes, stay inside the visible day, and never overlap.
 * NEW FEATURE requested by the owner (not in the original Master Plan): see DEVIATIONS.md #17.
 */
export const DAY_START = 16 * 60; // 4:00 PM
export const DAY_END = 22 * 60;   // 10:00 PM
export const SNAP = 15;
export const MIN_LEN = 15;

export type Tone = "blue" | "teal" | "sand" | "muted" | "unsorted";
export type Block = { id: string; title: string; start: number; end: number; tone: Tone };
export type Task = { id: string; title: string; len: number; tone: Tone };
type Span = { start: number; end: number };

export const snap = (m: number): number => Math.round(m / SNAP) * SNAP;
export const overlaps = (a: Span, b: Span): boolean => a.start < b.end && b.start < a.end;

/** Can this span exist (inside the day, long enough, not touching another block)? `id` is ignored so a block can move over itself. */
export function canPlace(blocks: Block[], id: string, start: number, end: number): boolean {
  if (start < DAY_START || end > DAY_END || end - start < MIN_LEN) return false;
  return !blocks.some((b) => b.id !== id && overlaps({ start, end }, b));
}

const find = (blocks: Block[], id: string) => blocks.find((b) => b.id === id);

/** Move a block so it starts at `toStart` (snapped). If that is not allowed, nothing changes. */
export function moveBlock(blocks: Block[], id: string, toStart: number): Block[] {
  const b = find(blocks, id);
  if (!b) return blocks;
  const len = b.end - b.start;
  const start = Math.max(DAY_START, Math.min(DAY_END - len, snap(toStart)));
  return canPlace(blocks, id, start, start + len) ? blocks.map((x) => (x.id === id ? { ...x, start, end: start + len } : x)) : blocks;
}

/** Change where a block ends (its length). Not allowed past the next block or the end of the day. */
export function resizeBlock(blocks: Block[], id: string, toEnd: number): Block[] {
  const b = find(blocks, id);
  if (!b) return blocks;
  const end = Math.min(DAY_END, Math.max(b.start + MIN_LEN, snap(toEnd)));
  return canPlace(blocks, id, b.start, end) ? blocks.map((x) => (x.id === id ? { ...x, end } : x)) : blocks;
}

/** Earliest start (on the 15-minute grid) where a block of `len` minutes fits, or null if the day is full. */
export function firstFree(blocks: Block[], len: number): number | null {
  for (let s = DAY_START; s + len <= DAY_END; s += SNAP) if (canPlace(blocks, "__new__", s, s + len)) return s;
  return null;
}

export function addTask(blocks: Block[], t: Task): Block[] | null {
  if (find(blocks, t.id)) return blocks;
  const s = firstFree(blocks, t.len);
  return s === null ? null : [...blocks, { id: t.id, title: t.title, start: s, end: s + t.len, tone: t.tone }];
}

export const removeBlock = (blocks: Block[], id: string): Block[] => blocks.filter((b) => b.id !== id);

/** 1020 -> "5:00 PM" */
export function fmtTime(m: number): string {
  const h = Math.floor(m / 60), mm = m % 60;
  return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
/** Short on-screen range: "5:00 – 6:30 PM" */
export function fmtShort(b: Span): string {
  const a = fmtTime(b.start), z = fmtTime(b.end);
  return a.slice(-2) === z.slice(-2) ? `${a.slice(0, -3)} – ${z}` : `${a} – ${z}`;
}
/** Spoken range for screen readers: "5:00 PM to 6:30 PM" */
export const fmtSpoken = (b: Span): string => `${fmtTime(b.start)} to ${fmtTime(b.end)}`;

/** Example day: what the website demo starts with. Titles reuse the brain-dump example from the plan. */
export const INITIAL_BLOCKS: Block[] = [
  { id: "dbms", title: "DBMS assignment", start: 17 * 60, end: 18 * 60 + 30, tone: "blue" },
  { id: "break", title: "Break (Snack)", start: 18 * 60 + 30, end: 18 * 60 + 45, tone: "sand" },
  { id: "plan", title: "Plan tomorrow", start: 21 * 60, end: 21 * 60 + 15, tone: "muted" },
];
export const TASKS: Task[] = [
  { id: "physics", title: "Revise physics, ch. 3", len: 60, tone: "teal" },
  { id: "notebook", title: "Buy notebook", len: 30, tone: "unsorted" },
];
