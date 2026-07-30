"use client";
import { useEffect, useState, useCallback } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import { Site } from "@/lib/types";
import { showToast } from "@/lib/toast";

type FormState = {
  id?: string;
  name: string;
  description: string;
  url: string;
  category: string;
  ministry: string;
  state: string;
  level: "Central" | "State" | "District";
  languages: string;
  tags: string;
  featured: boolean;
  verified_date: string;
};

const EMPTY: FormState = {
  name: "",
  description: "",
  url: "",
  category: "",
  ministry: "",
  state: "",
  level: "Central",
  languages: "English",
  tags: "",
  featured: false,
  verified_date: new Date().toISOString().slice(0, 10),
};

export default function ListingsManager() {
  const [sites, setSites] = useState<Site[]>([]);
  const [categories, setCategories] = useState<{ id: string; key: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [sitesRes, catsRes] = await Promise.all([fetch("/api/sites?sort=az"), fetch("/api/categories")]);
    const sitesData = await sitesRes.json();
    const catsData = await catsRes.json();
    setSites(sitesData.sites || []);
    setCategories(catsData.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  function openAdd() {
    setForm({ ...EMPTY, category: categories[0]?.key || "" });
    setError("");
    setModalOpen(true);
  }

  function openEdit(site: Site) {
    setForm({
      id: site.id,
      name: site.name,
      description: site.description,
      url: site.url,
      category: site.category,
      ministry: site.ministry,
      state: site.state || "",
      level: site.level as FormState["level"],
      languages: site.languages.join(", "),
      tags: site.tags.join(", "),
      featured: site.featured,
      verified_date: site.verified_date,
    });
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      url: form.url,
      category: form.category,
      ministry: form.ministry,
      state: form.state || null,
      level: form.level,
      languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      verified_date: form.verified_date,
    };
    try {
      const res = await fetch(form.id ? `/api/sites/${form.id}` : "/api/sites", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save this listing");
      showToast(form.id ? "Listing updated" : "Listing added");
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save this listing");
    } finally {
      setSaving(false);
    }
  }

  async function remove(site: Site) {
    if (!confirm(`Delete "${site.name}"? This can't be undone.`)) return;
    const res = await fetch(`/api/sites/${site.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Listing deleted");
      setSites((s) => s.filter((x) => x.id !== site.id));
    } else {
      showToast("Couldn't delete this listing");
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Listings</h2>
        <button className="primary-btn" style={{ padding: "9px 16px" }} onClick={openAdd}>
          + Add website
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading listings…</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Level</th>
                <th>Last verified</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sites.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.category}</td>
                  <td>{s.level}</td>
                  <td className="mono">{s.verified_date}</td>
                  <td>
                    <span className="badge ok">Verified</span>
                    {s.featured && (
                      <span className="badge pending" style={{ marginLeft: 6 }}>
                        Featured
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="iconbtn-sm" onClick={() => openEdit(s)} aria-label="Edit">
                        <Pencil size={13} />
                      </button>
                      <button className="iconbtn-sm danger" onClick={() => remove(s)} aria-label="Delete">
                        <Trash2 size={13} />
                      </button>
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
              <h3 className="disp" style={{ fontSize: 18 }}>{form.id ? "Edit listing" : "Add website"}</h3>
              <button onClick={() => setModalOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>

            <form className="stack" style={{ marginTop: 16, maxWidth: "100%" }} onSubmit={save}>
              <div>
                <label>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label>Description</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label>Official URL</label>
                <input type="url" required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Category</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Choose</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.key}>
                        {c.key}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as FormState["level"] })}>
                    <option>Central</option>
                    <option>State</option>
                    <option>District</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Ministry / Department</label>
                <input required value={form.ministry} onChange={(e) => setForm({ ...form, ministry: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>State (optional)</label>
                  <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
                <div>
                  <label>Last verified</label>
                  <input type="date" required value={form.verified_date} onChange={(e) => setForm({ ...form, verified_date: e.target.value })} />
                </div>
              </div>
              <div>
                <label>Languages (comma separated)</label>
                <input value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
              </div>
              <div>
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <label className="filter-opt" style={{ padding: 0 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Feature on homepage
              </label>
              {error && <div className="field-error">{error}</div>}
              <button className="primary-btn block" type="submit" disabled={saving}>
                {saving ? "Saving…" : form.id ? "Save changes" : "Add listing"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
