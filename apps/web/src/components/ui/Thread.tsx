"use client";
import { useRef } from "react";
import { useScrub } from "@/hooks/useScrub";

/**
 * A thin amber thread that draws itself between two sections as you scroll (and un-draws as you scroll back).
 * It carries the eye from one scene into the next so sections feel connected, not stacked.
 */
export function Thread({ height = "22vh" }: { height?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrub(ref, { mode: "pass" });
  return (
    <div className="thread" ref={ref} style={{ height }} aria-hidden="true">
      <i />
    </div>
  );
}
