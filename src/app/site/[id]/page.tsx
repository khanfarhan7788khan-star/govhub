import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ChevronRight, ExternalLink } from "lucide-react";
import { getSiteById, getRelatedSites, getFavoriteIdSet } from "@/lib/sites";
import Seal from "@/components/Seal";
import SiteActions from "@/components/SiteActions";

export const dynamic = "force-dynamic";

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteById(id);
  if (!site) notFound();

  const store = await cookies();
  const sid = store.get("govhub_sid")?.value;
  const [related, favIds] = await Promise.all([getRelatedSites(site.category, site.id), getFavoriteIdSet(sid)]);

  return (
    <section className="wrap" style={{ padding: "36px 24px 90px", maxWidth: 760 }}>
      <div className="breadcrumb">
        <Link href="/browse">Browse</Link>
        <ChevronRight size={12} />
        <Link href={`/browse?category=${encodeURIComponent(site.category)}`}>{site.category}</Link>
        <ChevronRight size={12} />
        <span>{site.name}</span>
      </div>

      <div className="detail-card fade-in">
        <div className="detail-head">
          <div className="detail-title-row">
            <Seal size={56} />
            <div>
              <h1 className="disp">{site.name}</h1>
              <div className="detail-meta">
                {site.ministry}
                {site.state ? ` · ${site.state}` : ""}
              </div>
            </div>
          </div>
        </div>

        <p style={{ color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.65, marginTop: 18 }}>{site.description}</p>

        <div className="field-grid">
          <div className="field">
            <label>Category</label>
            <div className="val">{site.category}</div>
          </div>
          <div className="field">
            <label>Level</label>
            <div className="val">{site.level} Government</div>
          </div>
          <div className="field">
            <label>Last verified</label>
            <div className="val verified mono">{site.verified_date}</div>
          </div>
          <div className="field">
            <label>Languages</label>
            <div className="val">{site.languages.join(", ")}</div>
          </div>
        </div>

        <a className="visit-btn" href={site.url} target="_blank" rel="noopener noreferrer">
          <span className="mono">{site.url.replace("https://", "")}</span>
          <ExternalLink size={16} color="#fff" />
        </a>

        <SiteActions siteId={site.id} siteUrl={site.url} initiallySaved={favIds.has(site.id)} />
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <div className="section-head">
            <h2 className="disp" style={{ fontSize: 17 }}>Related websites</h2>
          </div>
          <div className="related-grid">
            {related.map((r) => (
              <Link key={r.id} href={`/site/${r.id}`} className="related-tile">
                <div className="card-cat">{r.category}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{r.name}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
