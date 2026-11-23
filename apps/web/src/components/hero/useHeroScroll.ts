"use client";
import { useEffect, type RefObject } from "react";

/**
 * Drives the Lamp hero from scroll position. Ported 1:1 from the approved prototype.
 * - Scroll progress p (0..1) is smoothed ("inertia") so the light follows your finger/wheel gently.
 * - p controls: lamp light (--l), spread of the light pool (--sp), the darkness mask, camera push,
 *   notebook ink, pen, headline fade and the exit into the next section.
 * - Scrolling stops => p stops => the scene holds exactly where it is. Scrolling up reverses it.
 * - Reduced motion: scene is simply lit and static.
 */
const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ss = (a: number, b: number, x: number) => {
  x = clamp((x - a) / (b - a));
  return x * x * (3 - 2 * x);
};
// Scene coordinates (inside the 1900x800 drawing) of the pool of light and the lamp head
const PX = 740, PY = 640, HX = 592, HY = 382;
const SVGNS = "http://www.w3.org/2000/svg";

export function useHeroScroll(stageRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const find = <T extends Element>(s: string) => stage.querySelector<T>(s);
    const root = document.documentElement;
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pin = find<HTMLElement>(".pin"), scene = find<HTMLElement>(".scene"), dark = find<HTMLElement>("#dark");
    const wall = find<HTMLElement>("#wall"), copy = find<HTMLElement>(".copy"), cue = find<HTMLElement>(".cue");
    const lbl = find<HTMLElement>("#lbl"), pen = find<SVGGElement>("#pen"), dg = find<SVGGElement>("#dust");
    const back = find<SVGSVGElement>("#back"), front = find<SVGSVGElement>("#front");
    const labelWrap = lbl?.parentElement;
    if (!pin || !scene || !dark || !wall || !copy || !cue || !lbl || !labelWrap || !pen || !dg || !back || !front) {
      if (process.env.NODE_ENV !== "production") console.warn("[Stilldesk] The hero scene could not find one of its elements, so it is paused: check its markup.");
      return;
    }
    const svgs = [back, front];
    const inks = Array.from(stage.querySelectorAll<SVGPathElement>(".ink"));

    // dust motes drifting through the beam (hidden entirely for reduced motion)
    const dust: { x: number; y: number; v: number; ph: number; el: SVGCircleElement }[] = [];
    if (!rm) {
      const n = innerWidth <= 900 ? 14 : 30;
      for (let i = 0; i < n; i++) {
        const el = document.createElementNS(SVGNS, "circle");
        el.setAttribute("r", (0.8 + Math.random() * 1.6).toFixed(1));
        el.setAttribute("fill", "#FFE9C8");
        dg.appendChild(el);
        dust.push({ x: 470 + Math.random() * 540, y: 346 + Math.random() * 326, v: 0.12 + Math.random() * 0.22, ph: Math.random() * 6.28, el });
      }
    }

    let port = false, last = "", target = rm ? 1 : 0, cur = target, sc = 1, pc: [number, number] = [0, 0];
    const t0 = performance.now();

    const layout = () => {
      const W = innerWidth, H = pin.clientHeight;
      port = W <= 900;
      const vb = port ? [170, 120, 860, 680] : [-700, 0, 1900, 800];
      svgs.forEach((s) => s.setAttribute("viewBox", vb.join(" ")));
      sc = Math.min(W / vb[2], H / vb[3]);
      const ox = W - vb[2] * sc, oy = H - vb[3] * sc;
      const m = (x: number, y: number): [number, number] => [ox + (x - vb[0]) * sc, oy + (y - vb[1]) * sc];
      pc = m(PX, PY);
      const h = m(HX, HY);
      wall.style.setProperty("--cx", h[0] + "px");
      wall.style.setProperty("--cy", h[1] + "px");
      last = "";
    };

    const progress = () => {
      if (rm) return 1;
      const r = stage.getBoundingClientRect(), tot = r.height - innerHeight;
      return tot > 0 ? clamp(-r.top / tot) : 0;
    };

    const render = (t: number) => {
      const p = cur;
      const iv = ss(0, 1, (t - t0) / 1300);
      const intro = rm ? 1 : clamp(iv + 0.07 * Math.sin(iv * 20) * (1 - iv)); // tiny bulb flicker as it warms up
      const l = rm ? 1 : clamp(intro * 0.14 + 0.86 * ss(0, 0.5, p));
      const sp = rm ? 1 : clamp(0.34 + 0.66 * ss(0.1, 0.82, p));
      // reduced motion shows the static, fully lit scene WITH the headline: never fade the text out or exit the scene
      const ex = rm ? 0 : ss(0.86, 1, p), tf = rm ? 0 : ss(0.42, 0.7, p);
      const br = !rm && p > 0.55 ? 1 + 0.045 * Math.sin((t / 6000) * 2 * Math.PI) + 0.012 * Math.sin(t / 1700) : 1; // glow-only breath
      const key = [p, l, sp, ex, tf, br].map((n) => n.toFixed(4)).join();
      if (key === last) return;
      last = key;

      root.style.setProperty("--l", String(l));
      root.style.setProperty("--sp", String(sp));
      root.style.setProperty("--b", String(br));

      // darkness mask: the pool of light opens up and reveals the desk
      const r1 = (40 + 330 * sp) * sc * (port ? 1.6 : 1.15), r2 = r1 * (1.7 + 0.6 * sp), a = (0.96 - 0.34 * sp).toFixed(3);
      dark.style.background = `radial-gradient(ellipse ${r2}px ${r2 * 0.62}px at ${pc[0]}px ${pc[1]}px,rgba(10,10,11,0) ${r1 * 0.45}px,rgba(10,10,11,${a}) ${r2}px)`;

      // slow camera push + continuous exit into the page colour
      scene.style.transformOrigin = `${pc[0]}px ${pc[1]}px`;
      scene.style.transform = `translateY(${-ex * 7}vh) scale(${(rm ? 1 : 1 + 0.07 * ss(0, 0.85, p)).toFixed(4)})`;
      scene.style.opacity = (1 - 0.78 * ex).toFixed(3);
      labelWrap.style.opacity = (1 - ex).toFixed(3);

      // notebook ink writes itself as the light reaches the page; pen glides in
      inks.forEach((e) => {
        const s = Number(e.dataset.s);
        e.style.strokeDashoffset = (1 - ss(s, s + 0.1, p)).toFixed(3);
      });
      const pe = 1 - ss(0.28, 0.78, p);
      pen.style.transform = `translate(${(46 * pe).toFixed(1)}px,${(9 * pe).toFixed(1)}px)`;

      copy.style.opacity = (1 - tf).toFixed(3);
      copy.style.transform = `${port ? "" : "translateY(-50%) "}translateY(${-tf * 28}px)`;
      copy.style.visibility = tf > 0.97 ? "hidden" : "visible";
      cue.style.opacity = String(clamp(1 - p * 12));
      lbl.textContent = l > 0.2 ? "Studying" : "Ready"; // the lamp always comes with words, never colour alone
    };

    let raf = 0, prevT = performance.now(), visible = true, alive = true;
    const tick = (t: number) => {
      raf = 0;
      if (!alive || !stage.isConnected) return; // the hero was removed (page change): stop quietly
      if (!rm) {
        // time-based smoothing: same feel at 30, 60 or 120 fps, and it always settles exactly on the target
        const k = 1 - Math.exp(-Math.min(0.1, (t - prevT) / 1000) * 9);
        const d = progress() - cur;
        cur = Math.abs(d) < 0.0004 ? cur + d : cur + d * k;
      }
      prevT = t;
      render(t);
      for (const o of dust) {
        o.y -= o.v;
        o.x += Math.sin(t / 1800 + o.ph) * 0.15;
        if (o.y < 340) o.y = 672;
        o.el.setAttribute("cx", o.x.toFixed(1));
        o.el.setAttribute("cy", o.y.toFixed(1));
        o.el.setAttribute("opacity", (0.2 + 0.55 * Math.abs(Math.sin(t / 1500 + o.ph))).toFixed(2));
      }
      // keep drawing only while the hero is on screen (or still easing to its target); otherwise sleep until scrolled back
      if (visible || Math.abs(progress() - cur) > 0.0004) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && !rm) { prevT = performance.now(); raf = requestAnimationFrame(tick); } };
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; stage.classList.toggle("paused", !visible); if (visible) wake(); }, { rootMargin: "100px 0px" });
    io.observe(stage);

    layout();
    addEventListener("resize", layout);
    addEventListener("scroll", wake, { passive: true });
    if (rm) render(performance.now());
    else raf = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("scroll", wake);
      removeEventListener("resize", layout);
      dust.forEach((o) => o.el.remove());
    };
  }, [stageRef]);
}
