"use client";

/** Last-resort fallback if the whole app fails. It must bring its own <html>, and uses inline styles because the CSS may not have loaded. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0A0A0B", color: "#F4F0E8", fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", padding: 24 }}>
        <main style={{ maxWidth: 520 }}>
          <h1 style={{ fontSize: "2rem", margin: "0 0 12px" }}>Something went wrong.</h1>
          <p style={{ color: "#d9d4ca", lineHeight: 1.6 }}>Stilldesk hit an unexpected problem. Please try again.</p>
          <button onClick={reset} style={{ minHeight: 48, padding: "0 26px", borderRadius: 999, border: 0, background: "#8497B8", color: "#0A0A0B", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
