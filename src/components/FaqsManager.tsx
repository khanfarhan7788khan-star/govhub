"use client";
import { useEffect, useState, useCallback } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast";

type FaqRow = { id: string; question: string; answer: string; sort_order: number };

export default function FaqsManager() {
  const [faqs, setFaqs] = useState<FaqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{ id?: string; question: string; answer: string; sort_order: number }>({
    question: "", answer: "", sort_order: 0,
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/faqs");
    const data = await res.json();
    setFaqs(data.faqs || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  function openAdd() {
    setForm({ question: "", answer: "", sort_order: faqs.length + 1 });
    setModalOpen(true);
  }
  function openEdit(f: FaqRow) {
    setForm({ id: f.id, question: f.question, answer: f.answer, sort_order: f.sort_order });
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(form.id ? `/api/faqs/${form.id}` : "/api/faqs", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: form.question, answer: form.answer, sort_order: form.sort_order }),
      });
      if (!res.ok) throw new Error();
      showToast(form.id ? "FAQ updated" : "FAQ added");
      setModalOpen(false);
      load();
    } catch {
      showToast("Couldn't save this FAQ");
    } finally {
      setSaving(false);
    }
  }

  async function remove(f: FaqRow) {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/faqs/${f.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("FAQ deleted");
      setFaqs((s) => s.filter((x) => x.id !== f.id));
    } else showToast("Couldn't delete this FAQ");
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">FAQs</h2>
        <button className="primary-btn" style={{ padding: "9px 16px" }} onClick={openAdd}>+ Add FAQ</button>
      </div>
      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading…</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f) => (
            <div key={f.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{f.question}</div>
                <div className="row-actions">
                  <button className="iconbtn-sm" onClick={() => openEdit(f)}><Pencil size={13} /></button>
                  <button className="iconbtn-sm danger" onClick={() => remove(f)}><Trash2 size={13} /></button>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 6 }}>{f.answer}</p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="disp" style={{ fontSize: 18 }}>{form.id ? "Edit FAQ" : "Add FAQ"}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--ink-soft)" }}><X size={18} /></button>
            </div>
            <form className="stack" style={{ marginTop: 16 }} onSubmit={save}>
              <div><label>Question</label><input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} /></div>
              <div><label>Answer</label><textarea required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></div>
              <div><label>Sort order</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
              <button className="primary-btn block" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
