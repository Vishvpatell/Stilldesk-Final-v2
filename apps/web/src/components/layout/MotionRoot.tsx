"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide motion plumbing (renders nothing):
 * 1. Adds class "rm" to <html> when the visitor prefers reduced motion (CSS then shows final states instantly).
 * 2. Reveals every element marked .rv when it scrolls into view. Without JS, .rv content is simply visible.
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

  return null;
}
