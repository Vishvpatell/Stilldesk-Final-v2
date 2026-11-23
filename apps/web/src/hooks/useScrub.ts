"use client";
import { useEffect, useRef, type RefObject } from "react";

/**
 * One shared engine for every scroll-linked scene.
 *
 * It turns "how far through this section am I?" into a number p (0..1), smooths it gently, and writes it
 * to the element as the CSS variable --p. CSS (and an optional onUpdate callback) then draw the scene from p.
 * Because the scene is a pure function of p, scrolling UP plays everything backwards, and stopping holds it still.
 *
 *  mode "pin":  the element is tall and contains a sticky child; p = progress while it is pinned.
 *  mode "pass": p = 0 when the element enters the bottom of the screen, 1 when it leaves the top.
 *
 * On narrow screens "pin" falls back to "pass" (no pinned scenes on mobile). Reduced motion: p = 1, no loop.
 *
 * SAFETY (fixes "Cannot read properties of null"): when a page is removed (for example a click on a footer link),
 * React clears the component's ref FIRST and only runs this effect's cleanup a moment later. A frame that was already
 * queued could run in that gap. So the hook (1) hands the scene its element as the 2nd argument of onUpdate, so scenes
 * never re-read `ref.current`, and (2) refuses to run a frame unless the element is still mounted and attached to the page.
 */
const clamp = (x: number) => Math.max(0, Math.min(1, x));
type Opts = { mode?: "pin" | "pass"; smooth?: number; onUpdate?: (p: number, el: HTMLElement) => void };

export function useScrub(ref: RefObject<HTMLElement | null>, { mode = "pin", smooth = 9, onUpdate }: Opts = {}) {
  // Always call the newest onUpdate, but store it after rendering (never during a render).
  const cb = useRef(onUpdate);
  useEffect(() => { cb.current = onUpdate; });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true; // becomes false the instant this effect is cleaned up: nothing may touch the page after that
    let cur = -1, raf = 0, prev = performance.now(), visible = false, lastApplied = -1;

    // The scene may only be drawn while React still has it mounted and it is attached to the page.
    const usable = () => alive && el.isConnected && ref.current === el;

    const raw = () => {
      const r = el.getBoundingClientRect(), vh = innerHeight;
      if (mode === "pin" && innerWidth > 900) {
        const tot = r.height - vh;
        return tot > 0 ? clamp(-r.top / tot) : 0;
      }
      return clamp((vh - r.top) / (vh + r.height));
    };
    const apply = (p: number) => {
      if (!usable()) return;
      if (Math.abs(p - lastApplied) < 0.0002 && p !== 0 && p !== 1) return;
      lastApplied = p;
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p, el);
    };

    if (rm) { apply(1); return () => { alive = false; }; }

    const tick = (t: number) => {
      raf = 0;
      if (!usable()) return; // being removed: stop quietly and do not schedule another frame
      const dt = Math.min(0.1, (t - prev) / 1000);
      prev = t;
      const target = raw();
      if (cur < 0) cur = target;
      const d = target - cur;
      cur = Math.abs(d) < 0.0005 ? target : cur + d * (1 - Math.exp(-dt * smooth));
      apply(cur);
      if (alive && (visible || cur !== target)) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && usable()) { prev = performance.now(); raf = requestAnimationFrame(tick); } };

    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; if (visible) start(); }, { rootMargin: "150px 0px" });
    io.observe(el);
    addEventListener("scroll", start, { passive: true });
    addEventListener("resize", start);
    start();
    return () => {
      alive = false;
      io.disconnect();
      removeEventListener("scroll", start);
      removeEventListener("resize", start);
      cancelAnimationFrame(raf);
      raf = 0;
    };
  }, [ref, mode, smooth]);
}
