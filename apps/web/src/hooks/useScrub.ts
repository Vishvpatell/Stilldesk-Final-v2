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
 */
const clamp = (x: number) => Math.max(0, Math.min(1, x));
type Opts = { mode?: "pin" | "pass"; smooth?: number; onUpdate?: (p: number) => void };

export function useScrub(ref: RefObject<HTMLElement | null>, { mode = "pin", smooth = 9, onUpdate }: Opts = {}) {
  const cb = useRef(onUpdate);
  cb.current = onUpdate;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cur = -1, raf = 0, prev = performance.now(), visible = false, lastApplied = -1;

    const raw = () => {
      const r = el.getBoundingClientRect(), vh = innerHeight;
      if (mode === "pin" && innerWidth > 900) {
        const tot = r.height - vh;
        return tot > 0 ? clamp(-r.top / tot) : 0;
      }
      return clamp((vh - r.top) / (vh + r.height));
    };
    const apply = (p: number) => {
      if (Math.abs(p - lastApplied) < 0.0002 && p !== 0 && p !== 1) return;
      lastApplied = p;
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p);
    };

    if (rm) { apply(1); return; }

    const tick = (t: number) => {
      raf = 0;
      const dt = Math.min(0.1, (t - prev) / 1000);
      prev = t;
      const target = raw();
      if (cur < 0) cur = target;
      const d = target - cur;
      cur = Math.abs(d) < 0.0005 ? target : cur + d * (1 - Math.exp(-dt * smooth));
      apply(cur);
      if (visible || cur !== target) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { prev = performance.now(); raf = requestAnimationFrame(tick); } };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { rootMargin: "150px 0px" });
    io.observe(el);
    addEventListener("scroll", start, { passive: true });
    addEventListener("resize", start);
    start();
    return () => { io.disconnect(); removeEventListener("scroll", start); removeEventListener("resize", start); cancelAnimationFrame(raf); };
  }, [ref, mode, smooth]);
}
