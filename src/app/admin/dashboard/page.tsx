import { query, queryOne, SiteRow } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const totalSites = (await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM sites"))?.c ?? 0;
  const totalCats = (await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM categories"))?.c ?? 0;
  const pendingReports =
    (await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM reports WHERE status = 'pending'"))?.c ?? 0;
  const pendingSuggestions =
    (await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM suggestions WHERE status = 'pending'"))?.c ?? 0;
  const totalMessages = (await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM messages"))?.c ?? 0;
  const recent = await query<SiteRow>("SELECT * FROM sites ORDER BY verified_date DESC LIMIT 6");

  const stats = [
    { n: totalSites, l: "Total listings" },
    { n: totalCats, l: "Categories" },
    { n: pendingReports, l: "Pending reports" },
    { n: pendingSuggestions, l: "Awaiting approval" },
    { n: totalMessages, l: "Messages" },
  ];

  return (
    <>
      <div className="section-head">
        <h2 className="disp">Overview</h2>
      </div>
      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div className="admin-stat" key={s.l}>
            <div className="n">{s.n}</div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="section-head">
        <h2 className="disp" style={{ fontSize: 16 }}>Recently verified</h2>
      </div>
      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Last verified</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td className="mono">{s.verified_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
