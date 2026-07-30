"use client";
import { useState, useEffect } from "react";

type Category = { id: string; key: string };

export default function SuggestForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", url: "", category: "", note: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("sent");
      setForm({ name: "", url: "", category: "", note: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "sent") {
    return <div className="form-success">Thanks — we&apos;ll review this website before it&apos;s published.</div>;
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      <div>
        <label>Website name</label>
        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div>
        <label>Official URL</label>
        <input
          type="url"
          placeholder="https://"
          required
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
      </div>
      <div>
        <label>Category</label>
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.key}>
              {c.key}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Why should this be listed?</label>
        <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      </div>
      {error && <div className="field-error">{error}</div>}
      <button className="primary-btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
