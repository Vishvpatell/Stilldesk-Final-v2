"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide motion plumbing (renders nothing):
 * 1. Adds class "rm" to <html> when the visitor prefers reduced motion (CSS then shows final states instantly).
 * 2. Reveals every element marked .rv when it scrolls into view. Without JS, .rv content is simply visible.
 * 3. Marks sections that are off screen with class "off"; CSS pauses their looping animations (steam, breathing, blinking) to save battery and CPU.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => document.documentElement.classList.toggle("rm", mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".rv:not(.in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { threshold: 0.2 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const sections = Array.from(document.querySelectorAll("main section"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => { io.disconnect(); sections.forEach((s) => s.classList.remove("off")); };
  }, [pathname]);

  return null;
}
