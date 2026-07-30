"use client";
import { useEffect, useState, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import { Category } from "@/lib/types";

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newKey.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't add category");
      setNewKey("");
      showToast("Category added");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add category");
    } finally {
      setAdding(false);
    }
  }

  async function remove(cat: Category) {
    if (cat.count > 0) {
      showToast(`Move or delete the ${cat.count} listing(s) in this category first`);
      return;
    }
    if (!confirm(`Delete category "${cat.key}"?`)) return;
    const res = await fetch(`/api/categories?id=${encodeURIComponent(cat.id)}`, { method: "DELETE" });
    if (res.ok) {
      showToast("Category deleted");
      setCategories((c) => c.filter((x) => x.id !== cat.id));
    } else {
      showToast("Couldn't delete category");
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Categories</h2>
      </div>

      <form onSubmit={addCategory} style={{ display: "flex", gap: 8, marginBottom: 20, maxWidth: 420 }}>
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="New category name"
          style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--ink)", fontSize: 13.5 }}
        />
        <button className="primary-btn" style={{ padding: "9px 16px" }} disabled={adding}>
          {adding ? "Adding…" : "+ Add"}
        </button>
      </form>
      {error && <div className="field-error" style={{ marginBottom: 12 }}>{error}</div>}

      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading categories…</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Listings</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.key}</td>
                  <td>{c.count}</td>
                  <td>
                    <button className="iconbtn-sm danger" onClick={() => remove(c)} aria-label="Delete category">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
