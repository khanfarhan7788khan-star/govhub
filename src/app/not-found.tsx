import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <section className="wrap" style={{ padding: "100px 24px", textAlign: "center" }}>
      <div style={{ display: "grid", placeItems: "center", marginBottom: 20 }}>
        <SearchX size={48} color="var(--saffron)" />
      </div>
      <h1 className="disp" style={{ fontSize: 32, fontWeight: 600 }}>Page not found</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 10, maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
        The page you&apos;re looking for doesn&apos;t exist, or the listing may have been removed. Try searching the directory instead.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 26, flexWrap: "wrap" }}>
        <Link href="/" className="primary-btn">Back to home</Link>
        <Link href="/browse" className="ghostbtn" style={{ flex: "0 1 auto", padding: "12px 22px" }}>Browse the directory</Link>
      </div>
    </section>
  );
}
