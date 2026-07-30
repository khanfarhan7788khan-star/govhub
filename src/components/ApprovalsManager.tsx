"use client";
import { useEffect, useState, useCallback } from "react";
import { showToast } from "@/lib/toast";

type Suggestion = {
  id: string;
  name: string;
  url: string;
  category: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export default function ApprovalsManager() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/suggestions");
    if (res.ok) {
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  async function decide(s: Suggestion, status: "approved" | "rejected") {
    const res = await fetch(`/api/suggestions/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setSuggestions((rows) => rows.map((r) => (r.id === s.id ? { ...r, status } : r)));
      showToast(status === "approved" ? "Approved and published to the directory" : "Suggestion rejected");
    } else {
      showToast("Couldn't update this suggestion");
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Approval queue</h2>
      </div>
      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading suggestions…</p>
      ) : suggestions.length === 0 ? (
        <div className="empty">
          <p>No suggestions yet.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Website</th>
                <th>URL</th>
                <th>Category</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td className="mono" style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {s.url}
                  </td>
                  <td>{s.category}</td>
                  <td>
                    <span
                      className={`badge ${s.status === "approved" ? "ok" : s.status === "rejected" ? "rejected" : "pending"}`}
                    >
                      {s.status === "approved" ? "Approved" : s.status === "rejected" ? "Rejected" : "Needs review"}
                    </span>
                  </td>
                  <td>
                    {s.status === "pending" ? (
                      <div className="row-actions">
                        <button className="iconbtn-sm" onClick={() => decide(s, "approved")}>
                          Approve
                        </button>
                        <button className="iconbtn-sm danger" onClick={() => decide(s, "rejected")}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>—</span>
                    )}
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
