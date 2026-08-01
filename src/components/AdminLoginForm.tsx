"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign in failed");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setBusy(false);
    }
  }

  return (
    <div className="admin-login fade-in">
      <h2 className="disp">Admin sign in</h2>
      <div className="sub">Manage listings, categories and reports.</div>
      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="faynx@govhub.in"
            style={{ width: "100%", marginTop: 5, padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", fontSize: 14 }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: "100%", marginTop: 5, padding: "11px 13px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", fontSize: 14 }}
          />
        </div>
        {error && <div className="field-error">{error}</div>}
        <button className="primary-btn block" type="submit" disabled={busy} style={{ width: "100%", marginTop: 6 }}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      
      </form>
    </div>
  );
}
