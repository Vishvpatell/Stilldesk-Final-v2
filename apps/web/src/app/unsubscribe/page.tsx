import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeAction } from "@/components/forms/UnsubscribeAction";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false }, alternates: {} };

export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <article className="legal thanks">
      {token ? <UnsubscribeAction token={token} /> : <><h1>That link doesn’t look right.</h1><p className="lead">Use the unsubscribe link in any Stilldesk email. <Link href="/">Home</Link></p></>}
    </article>
  );
}
