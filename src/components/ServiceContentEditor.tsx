"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { showToast } from "@/lib/toast";

type Detail = {
  overview: string;
  benefits: string;
  eligibility: string;
  documents: string;
  fees: string;
  processing_time: string;
  steps: string;
  important_notes: string;
  common_mistakes: string;
  faqs: string;
};

const EMPTY: Detail = {
  overview: "", benefits: "", eligibility: "", documents: "", fees: "",
  processing_time: "", steps: "", important_notes: "", common_mistakes: "", faqs: "",
};

export default function ServiceContentEditor({ siteId, siteName, onClose }: { siteId: string; siteName: string; onClose: () => void }) {
  const [form, setForm] = useState<Detail>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/service-details/${siteId}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.detail) {
          setForm({
            overview: d.detail.overview || "",
            benefits: d.detail.benefits || "",
            eligibility: d.detail.eligibility || "",
            documents: d.detail.documents || "",
            fees: d.detail.fees || "",
            processing_time: d.detail.processing_time || "",
            steps: d.detail.steps || "",
            important_notes: d.detail.important_notes || "",
            common_mistakes: d.detail.common_mistakes || "",
            faqs: d.detail.faqs || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [siteId]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/service-details/${siteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast("Service content saved");
      onClose();
    } catch {
      showToast("Couldn't save service content");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 className="disp" style={{ fontSize: 18 }}>Service content — {siteName}</h3>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", color: "var(--ink-soft)" }}>
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 16 }}>Loading…</p>
        ) : (
          <form className="stack" style={{ marginTop: 16, maxWidth: "100%" }} onSubmit={save}>
            <div><label>Overview</label><textarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} /></div>
            <div><label>Benefits (one per line, start with &quot;- &quot;)</label><textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} /></div>
            <div><label>Eligibility (one per line, start with &quot;- &quot;)</label><textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} /></div>
            <div><label>Documents required (one per line, start with &quot;- &quot;)</label><textarea value={form.documents} onChange={(e) => setForm({ ...form, documents: e.target.value })} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label>Fees</label><textarea value={form.fees} onChange={(e) => setForm({ ...form, fees: e.target.value })} style={{ minHeight: 70 }} /></div>
              <div><label>Processing time</label><textarea value={form.processing_time} onChange={(e) => setForm({ ...form, processing_time: e.target.value })} style={{ minHeight: 70 }} /></div>
            </div>
            <div><label>Step-by-step process (one per line, start with &quot;- &quot;)</label><textarea value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} /></div>
            <div><label>Important notes</label><textarea value={form.important_notes} onChange={(e) => setForm({ ...form, important_notes: e.target.value })} style={{ minHeight: 70 }} /></div>
            <div><label>Common mistakes (one per line, start with &quot;- &quot;)</label><textarea value={form.common_mistakes} onChange={(e) => setForm({ ...form, common_mistakes: e.target.value })} /></div>
            <div>
              <label>FAQs — format each pair as &quot;Q: question&quot; then &quot;A: answer&quot;, blank line between pairs</label>
              <textarea value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} style={{ minHeight: 140, fontFamily: "var(--font-plex-mono), monospace", fontSize: 12.5 }} />
            </div>
            <button className="primary-btn block" type="submit" disabled={saving}>{saving ? "Saving…" : "Save service content"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
