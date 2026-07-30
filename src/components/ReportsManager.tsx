"use client";
import { useEffect, useState, useCallback } from "react";
import { showToast } from "@/lib/toast";

type Report = {
  id: string;
  site_id: string;
  site_name: string | null;
  note: string | null;
  status: "pending" | "resolved";
  created_at: string;
};

export default function ReportsManager() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/reports");
    if (res.ok) {
      const data = await res.json();
      setReports(data.reports || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount to load admin data from the API
    load();
  }, [load]);

  async function setStatus(report: Report, status: "pending" | "resolved") {
    const res = await fetch(`/api/reports/${report.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setReports((rs) => rs.map((r) => (r.id === report.id ? { ...r, status } : r)));
      showToast(status === "resolved" ? "Marked as resolved" : "Reopened");
    } else {
      showToast("Couldn't update this report");
    }
  }

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Broken link reports</h2>
      </div>
      {loading ? (
        <p style={{ color: "var(--ink-soft)", fontSize: 13.5 }}>Loading reports…</p>
      ) : reports.length === 0 ? (
        <div className="empty">
          <p>No reports yet.</p>
        </div>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Reported</th>
                <th>Note</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id}>
                  <td>{r.site_name || r.site_id}</td>
                  <td className="mono">{r.created_at.slice(0, 10)}</td>
                  <td style={{ maxWidth: 260 }}>{r.note || <span style={{ color: "var(--ink-soft)" }}>—</span>}</td>
                  <td>
                    <span className={`badge ${r.status === "resolved" ? "ok" : "pending"}`}>
                      {r.status === "resolved" ? "Resolved" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="iconbtn-sm"
                      onClick={() => setStatus(r, r.status === "resolved" ? "pending" : "resolved")}
                    >
                      {r.status === "resolved" ? "Reopen" : "Mark resolved"}
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
