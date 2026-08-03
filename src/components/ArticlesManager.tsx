"use client";
import { useEffect, useState, useCallback } from "react";
import { X, Pencil, Trash2, Eye } from "lucide-react";
import { showToast } from "@/lib/toast";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  featured: boolean;
  related_site_ids: string;
  views: number;
  published_date: string;
};

type FormState = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  featured: boolean;
  related_site_ids: string;
  published_date: string;
};

const EMPTY: FormState = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  author: "GovHub Editorial Team",
  featured: false,
  related_site_ids: "",
  published_date: new Date().toISOString().slice(0, 10),
};

export default function ArticlesManager() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; key: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [artRes, catRes] = await Promise.all([fetch("/api/articles"), fetch("/api/categories")]);
    const artData = await artRes.json();
    const catData = await catRes.json();
    setArticles(artData.articles || []);
    setCategories(catData.categories || []);
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

  function openEdit(a: ArticleRow) {
    setForm({
      id: a.id,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      tags: a.tags,
      author: a.author,
      featured: a.featured,
      related_site_ids: a.related_site_ids,
      published_date: a.published_date,
    });
    setError("");
    setModalOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      author: form.author,
      featured: form.featured,
      related_site_ids: form.related_site_ids.split(",").map((s) => s.trim()).filter(Boolean),
      published_date: form.published_date,
    };
    try {
      const res = await fetch(form.id ? `/api/articles/${form.id}` : "/api/articles", {
        method: form.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't save this article");
      showToast(form.id ? "Article updated" : "Article published");
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save this article");
    } finally {
      setSaving(false);
    }
  }

  async function remove(a: ArticleRow) {
    if (!confirm(`Delete "${a.title}"? This can't be undone.`)) return;
    const res = await fetch(`/api/articles/${a.id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Article deleted");
      setArticles((s) => s.filter((x) => x.id !== a.id));
    } else {
      showToast("Couldn't delete this article");
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Articles</h2>
        <button className="primary-btn" style={{ padding: "9px 16px" }} onClick={openAdd}>
          + New article
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading articles…</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published</th>
                <th>Views</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.category}</td>
                  <td className="mono">{a.published_date}</td>
                  <td>{a.views}</td>
                  <td>{a.featured && <span className="badge pending">Featured</span>}</td>
                  <td>
                    <div className="row-actions">
                      <a className="iconbtn-sm" href={`/blog/${a.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View">
                        <Eye size={13} />
                      </a>
                      <button className="iconbtn-sm" onClick={() => openEdit(a)} aria-label="Edit">
                        <Pencil size={13} />
                      </button>
                      <button className="iconbtn-sm danger" onClick={() => remove(a)} aria-label="Delete">
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
          <div className="modal-card fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="disp" style={{ fontSize: 18 }}>{form.id ? "Edit article" : "New article"}</h3>
              <button onClick={() => setModalOpen(false)} aria-label="Close" style={{ background: "none", border: "none", color: "var(--ink-soft)" }}>
                <X size={18} />
              </button>
            </div>

            <form className="stack" style={{ marginTop: 16, maxWidth: "100%" }} onSubmit={save}>
              <div>
                <label>Title</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label>Excerpt (shown in listings)</label>
                <textarea required value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} style={{ minHeight: 60 }} />
              </div>
              <div>
                <label>Content — use &quot;## Heading&quot; for sections, &quot;- &quot; for bullet lists, blank lines between paragraphs</label>
                <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ minHeight: 240, fontFamily: "var(--font-plex-mono), monospace", fontSize: 12.5 }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label>Category</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Choose</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.key}>{c.key}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Published date</label>
                  <input type="date" required value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
                </div>
              </div>
              <div>
                <label>Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div>
                <label>Related site IDs (comma separated, e.g. uidai, passport)</label>
                <input value={form.related_site_ids} onChange={(e) => setForm({ ...form, related_site_ids: e.target.value })} />
              </div>
              <div>
                <label>Author</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <label className="filter-opt" style={{ padding: 0 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Feature on the Guides landing page
              </label>
              {error && <div className="field-error">{error}</div>}
              <button className="primary-btn block" type="submit" disabled={saving}>
                {saving ? "Saving…" : form.id ? "Save changes" : "Publish article"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
