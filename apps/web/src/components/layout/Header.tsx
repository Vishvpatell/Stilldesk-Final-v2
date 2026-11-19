"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

// Order and targets come from docs/02-sitemap-and-page-specs.md. "/#id" works from any page.
export const NAV = [
  { label: "The problem", href: "/#problem" },
  { label: "How it works", href: "/#loop" },
  { label: "Features", href: "/#features" },
  { label: "Free vs Pro", href: "/#plans" },
  { label: "Study together", href: "/#together" },
  { label: "FAQ", href: "/#faq" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const openBtn = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // header blur after leaving the top + thin reading-progress line
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(scrollY > 40);
        const h = document.documentElement.scrollHeight - innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);

  // menu: Escape closes, Tab stays inside, focus returns to the Menu button
  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); openBtn.current?.focus(); }
      if (e.key === "Tab" && menu.current) {
        const f = Array.from(menu.current.querySelectorAll<HTMLElement>("a,button"));
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div id="prog" ref={bar} aria-hidden="true" />
      <header className={`top${scrolled ? " sc" : ""}`}>
        <Link className="brand" href="/" aria-label="Stilldesk home"><span className="mark" aria-hidden="true" />Stilldesk</Link>
        <nav className="links" aria-label="Main">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        </nav>
        <div className="hdr-right">
          <ButtonLink href="/#waitlist" size="sm">Join the waitlist</ButtonLink>
          <button ref={openBtn} className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>Menu</button>
        </div>
      </header>
      <div ref={menu} className={`menu${open ? " open" : ""}`} id="menu" role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!open}>
        <button ref={closeBtn} className="close" onClick={() => { setOpen(false); openBtn.current?.focus(); }}>Close</button>
        {NAV.map((n) => <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>)}
        <Link href="/#waitlist" onClick={() => setOpen(false)}>Join the waitlist</Link>
      </div>
    </>
  );
}
