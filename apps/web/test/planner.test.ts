import test from "node:test";
import assert from "node:assert/strict";
import { DAY_END, DAY_START, INITIAL_BLOCKS, TASKS, addTask, canPlace, firstFree, fmtShort, fmtSpoken, fmtTime, moveBlock, overlaps, removeBlock, resizeBlock, snap } from "../src/lib/planner";

const dbms = () => INITIAL_BLOCKS.find((b) => b.id === "dbms")!;

test("time formatting", () => {
  assert.equal(fmtTime(17 * 60), "5:00 PM"); assert.equal(fmtTime(12 * 60 + 5), "12:05 PM"); assert.equal(fmtTime(0), "12:00 AM");
  assert.equal(fmtShort({ start: 17 * 60, end: 18 * 60 + 30 }), "5:00 – 6:30 PM");
  assert.equal(fmtShort({ start: 11 * 60 + 30, end: 12 * 60 + 30 }), "11:30 AM – 12:30 PM");
  assert.equal(fmtSpoken({ start: 17 * 60, end: 18 * 60 + 30 }), "5:00 PM to 6:30 PM");
});
test("snapping and overlap", () => {
  assert.equal(snap(17 * 60 + 7), 17 * 60); assert.equal(snap(17 * 60 + 8), 17 * 60 + 15);
  assert.equal(overlaps({ start: 0, end: 10 }, { start: 10, end: 20 }), false); // touching is fine
  assert.equal(overlaps({ start: 0, end: 11 }, { start: 10, end: 20 }), true);
});
test("move: snaps to 15 minutes, keeps length, stays in the day", () => {
  const m = moveBlock(INITIAL_BLOCKS, "dbms", 19 * 60 + 4).find((b) => b.id === "dbms")!;
  assert.deepEqual([m.start, m.end], [19 * 60, 20 * 60 + 30]);
  const early = moveBlock(INITIAL_BLOCKS, "dbms", 10 * 60).find((b) => b.id === "dbms")!; assert.equal(early.start, DAY_START);
  const late = moveBlock(INITIAL_BLOCKS, "dbms", 23 * 60).find((b) => b.id === "dbms")!; assert.equal(late.end <= DAY_END, true);
});
test("move/resize that would overlap another block is refused (nothing changes)", () => {
  assert.equal(moveBlock(INITIAL_BLOCKS, "dbms", 18 * 60), INITIAL_BLOCKS); // would sit on the break
  assert.equal(resizeBlock(INITIAL_BLOCKS, "dbms", 19 * 60), INITIAL_BLOCKS); // would run through the break
  assert.equal(moveBlock(INITIAL_BLOCKS, "nope", 1000), INITIAL_BLOCKS);
});
test("resize: minimum 15 minutes, snaps, can shrink and grow into free time", () => {
  const s = resizeBlock(INITIAL_BLOCKS, "dbms", 17 * 60 + 1).find((b) => b.id === "dbms")!; assert.equal(s.end - s.start, 15);
  const g = resizeBlock(INITIAL_BLOCKS, "plan", 22 * 60).find((b) => b.id === "plan")!; assert.equal(g.end, DAY_END);
  assert.equal(resizeBlock(INITIAL_BLOCKS, "plan", 23 * 60).find((b) => b.id === "plan")!.end, DAY_END); // never past 10 PM
});
test("add task: goes into the first gap that fits; full day returns null; no duplicates", () => {
  const phys = TASKS[0]!;
  const withPhys = addTask(INITIAL_BLOCKS, phys)!;
  const b = withPhys.find((x) => x.id === "physics")!; assert.deepEqual([b.start, b.end], [DAY_START, DAY_START + 60]); // 4-5 PM is free
  assert.equal(addTask(withPhys, phys), withPhys);
  const full = [{ id: "all", title: "all", start: DAY_START, end: DAY_END, tone: "blue" as const }];
  assert.equal(addTask(full, phys), null); assert.equal(firstFree(full, 15), null);
  assert.equal(firstFree(INITIAL_BLOCKS, 90), 18 * 60 + 45); // 4-5 is only 60 minutes, so the first 90-minute gap starts after the break
});
test("remove, and the example day itself is valid (no overlaps, inside the day)", () => {
  assert.equal(removeBlock(INITIAL_BLOCKS, "dbms").length, 2);
  for (const b of INITIAL_BLOCKS) assert.equal(canPlace(INITIAL_BLOCKS, b.id, b.start, b.end), true);
  assert.equal(dbms().end - dbms().start, 90);
});
