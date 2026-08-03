import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { ChevronRight, ExternalLink, CheckCircle2, Users, FileText, Wallet, Clock, ListChecks, AlertTriangle, ShieldAlert } from "lucide-react";
import { getSiteById, getRelatedSites, getFavoriteIdSet } from "@/lib/sites";
import { getServiceDetail } from "@/lib/content-data";
import Seal from "@/components/Seal";
import SiteActions from "@/components/SiteActions";
import InArticleAd from "@/components/ads/InArticleAd";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const site = await getSiteById(id);
  if (!site) return { title: "Listing not found" };
  return {
    title: site.name,
    description: site.description,
    alternates: { canonical: `/site/${site.id}` },
    openGraph: { title: site.name, description: site.description, type: "website" },
  };
}

export default async function SiteDetailPage({ params }: Props) {
  const { id } = await params;
  const site = await getSiteById(id);
  if (!site) notFound();

  const store = await cookies();
  const sid = store.get("govhub_sid")?.value;
  const [related, favIds, detail] = await Promise.all([
    getRelatedSites(site.category, site.id),
    getFavoriteIdSet(sid),
    getServiceDetail(site.id),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: site.category, path: `/browse?category=${encodeURIComponent(site.category)}` },
          { name: site.name, path: `/site/${site.id}` },
        ]}
      />
      {detail && detail.faqs.length > 0 && <FaqJsonLd faqs={detail.faqs} />}

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

          <p style={{ color: "var(--ink-soft)", fontSize: 14.5, lineHeight: 1.65, marginTop: 18 }}>
            {detail?.overview || site.description}
          </p>

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

        {detail && (
          <>
            {detail.benefits.length > 0 && (
              <div className="service-section">
                <h2 className="disp"><CheckCircle2 size={18} color="var(--sage)" /> Benefits</h2>
                <ul>{detail.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            )}

            {detail.eligibility.length > 0 && (
              <div className="service-section">
                <h2 className="disp"><Users size={18} color="var(--indigo)" /> Eligibility</h2>
                <ul>{detail.eligibility.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            )}

            {detail.documents.length > 0 && (
              <div className="service-section">
                <h2 className="disp"><FileText size={18} color="var(--indigo)" /> Documents required</h2>
                <ul>{detail.documents.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }} className="service-section">
              {detail.fees && (
                <div>
                  <h2 className="disp" style={{ fontSize: 16 }}><Wallet size={16} color="var(--saffron)" /> Fees</h2>
                  <p>{detail.fees}</p>
                </div>
              )}
              {detail.processing_time && (
                <div>
                  <h2 className="disp" style={{ fontSize: 16 }}><Clock size={16} color="var(--saffron)" /> Processing time</h2>
                  <p>{detail.processing_time}</p>
                </div>
              )}
            </div>

            {detail.steps.length > 0 && (
              <div className="service-section">
                <h2 className="disp"><ListChecks size={18} color="var(--indigo)" /> Step-by-step process</h2>
                <ol className="steps-list">{detail.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              </div>
            )}

            <InArticleAd />

            {detail.important_notes && (
              <div className="service-section">
                <h2 className="disp"><ShieldAlert size={18} color="var(--sage)" /> Important notes</h2>
                <p>{detail.important_notes}</p>
              </div>
            )}

            {detail.common_mistakes.length > 0 && (
              <div className="service-section">
                <h2 className="disp"><AlertTriangle size={18} color="var(--saffron)" /> Common mistakes to avoid</h2>
                <ul>{detail.common_mistakes.map((b, i) => <li key={i}>{b}</li>)}</ul>
              </div>
            )}

            {detail.faqs.length > 0 && (
              <div className="service-section">
                <h2 className="disp">Frequently asked questions</h2>
                <div>
                  {detail.faqs.map((f, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>{f.q}</div>
                      <p style={{ margin: 0 }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="trust-box" style={{ marginTop: 34 }}>
              <strong>Editor&apos;s note:</strong> This information is provided for general guidance and is checked
              periodically against official sources. Fees, timelines, and eligibility rules can change — always
              confirm current details on the official website above before applying.
            </div>
          </>
        )}

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
    </>
  );
}
