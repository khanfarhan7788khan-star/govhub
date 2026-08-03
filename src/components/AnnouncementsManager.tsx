"use client";
import { useEffect, useState, useCallback } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast";

type AnnRow = { id: string; title: string; body: string; level: string; active: boolean };

export default function AnnouncementsManager() {
  const [rows, setRows] = useState<AnnRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{ id?: string; title: string; body: string; level: string; active: boolean }>({
    title: "", body: "", level: "info", active: true,
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/announcements");
    const data = await res.json();
    setRows(data.announcements || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  function openAdd() {
    setForm({ title: "", body: "", level: "info", active: true });
    setModalOpen(true);
  }
  function openEdit(a: AnnRow) {
    setForm({ id: a.id, title: a.title, body: a.body, level: a.level, active: a.active });
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(form.id ? `/api/announcements/${form.id}` : "/api/announcements", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast(form.id ? "Announcement updated" : "Announcement added");
      setModalOpen(false);
      load();
    } catch {
      showToast("Couldn't save this announcement");
    } finally {
      setSaving(false);
    }
  }

  async function remove(a: AnnRow) {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/announcements/${a.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Announcement deleted");
      setRows((s) => s.filter((x) => x.id !== a.id));
    } else showToast("Couldn't delete this announcement");
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Announcements</h2>
        <button className="primary-btn" style={{ padding: "9px 16px" }} onClick={openAdd}>+ Add announcement</button>
      </div>
      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading…</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Level</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.level}</td>
                  <td><span className={`badge ${a.active ? "ok" : "pending"}`}>{a.active ? "Active" : "Hidden"}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="iconbtn-sm" onClick={() => openEdit(a)}><Pencil size={13} /></button>
                      <button className="iconbtn-sm danger" onClick={() => remove(a)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="disp" style={{ fontSize: 18 }}>{form.id ? "Edit announcement" : "New announcement"}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: "var(--ink-soft)" }}><X size={18} /></button>
            </div>
            <form className="stack" style={{ marginTop: 16 }} onSubmit={save}>
              <div><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label>Body</label><textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
              <div>
                <label>Level</label>
                <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                </select>
              </div>
              <label className="filter-opt" style={{ padding: 0 }}>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                Active (visible on site)
              </label>
              <button className="primary-btn block" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
