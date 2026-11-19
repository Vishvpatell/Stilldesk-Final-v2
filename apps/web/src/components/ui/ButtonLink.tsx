import Link from "next/link";
import type { ReactNode } from "react";

type Props = { href: string; children: ReactNode; size?: "md" | "sm"; variant?: "primary" | "text" | "ghost" };

/** The one button style: muted blue-grey fill (amber stays reserved for the Lamp). */
export function ButtonLink({ href, children, size = "md", variant = "primary" }: Props) {
  const cls = variant === "text" ? "link" : `btn${variant === "ghost" ? " ghost" : ""}${size === "sm" ? " sm" : ""}`;
  return <Link className={cls} href={href}>{children}</Link>;
}
