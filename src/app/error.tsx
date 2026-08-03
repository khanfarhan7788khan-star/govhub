"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="wrap" style={{ padding: "100px 24px", textAlign: "center" }}>
      <div style={{ display: "grid", placeItems: "center", marginBottom: 20 }}>
        <AlertOctagon size={48} color="var(--danger)" />
      </div>
      <h1 className="disp" style={{ fontSize: 32, fontWeight: 600 }}>Something went wrong</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
        An unexpected error occurred while loading this page. It&apos;s been logged — try again, or head back home.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        <button className="primary-btn" onClick={reset}>Try again</button>
        <Link href="/" className="ghostbtn" style={{ flex: "0 1 auto", padding: "12px 22px" }}>Back to home</Link>
      </div>
    </section>
  );
}
