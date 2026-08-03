import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, Clock, User, ChevronRight, RefreshCw } from "lucide-react";
import { getArticleBySlug, getRelatedArticles, incrementArticleViews } from "@/lib/content-data";
import { getSiteById } from "@/lib/sites";
import ContentRenderer from "@/components/ContentRenderer";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";
import InArticleAd from "@/components/ads/InArticleAd";
import SidebarAd from "@/components/ads/SidebarAd";
import Seal from "@/components/Seal";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.published_date,
      modifiedTime: article.updated_date,
    },
    twitter: { card: "summary_large_image", title: article.title, description: article.excerpt },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  incrementArticleViews(article.id).catch(() => {});
  const [related, relatedSites] = await Promise.all([
    getRelatedArticles(article.category, article.id),
    Promise.all(article.related_site_ids.map((id) => getSiteById(id))),
  ]);
  const validRelatedSites = relatedSites.filter((s): s is NonNullable<typeof s> => s !== null);

  // split content roughly in half to slot an in-article ad
  const contentLines = article.content.split("\n\n");
  const mid = Math.floor(contentLines.length / 2);
  const firstHalf = contentLines.slice(0, mid).join("\n\n");
  const secondHalf = contentLines.slice(mid).join("\n\n");

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        slug={article.slug}
        author={article.author}
        publishedDate={article.published_date}
        updatedDate={article.updated_date}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Guides", path: "/blog" },
          { name: article.title, path: `/blog/${article.slug}` },
        ]}
      />

      <section className="wrap" style={{ padding: "36px 24px 90px" }}>
        <div className="breadcrumb">
          <Link href="/blog">Guides</Link>
          <ChevronRight size={12} />
          <Link href={`/blog?category=${encodeURIComponent(article.category)}`}>{article.category}</Link>
          <ChevronRight size={12} />
          <span>{article.title}</span>
        </div>

        <div className="browse-layout">
          <div style={{ minWidth: 0 }}>
            <span className="card-cat">{article.category}</span>
            <h1 className="disp" style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 600, marginTop: 8, lineHeight: 1.15 }}>
              {article.title}
            </h1>

            <div className="article-meta-row">
              <span className="meta-item"><User size={13} /> {article.author}</span>
              <span className="meta-item"><Calendar size={13} /> Published {article.published_date}</span>
              <span className="meta-item"><RefreshCw size={13} /> Updated {article.updated_date}</span>
              <span className="meta-item"><Clock size={13} /> {article.reading_minutes} min read</span>
            </div>

            <ContentRenderer text={firstHalf} />
            <InArticleAd />
            <ContentRenderer text={secondHalf} />

            <div className="trust-box">
              <strong>Editor&apos;s note:</strong> This guide is written and maintained by the GovHub editorial team
              based on publicly available information from official government sources. It is provided for general
              guidance only — always confirm current fees, forms, and requirements on the official portal linked
              below before applying, since government processes can change.
            </div>

            {validRelatedSites.length > 0 && (
              <div className="service-section">
                <h2 className="disp">Related official portals</h2>
                <div className="related-grid">
                  {validRelatedSites.map((s) => (
                    <Link key={s.id} href={`/site/${s.id}`} className="related-tile" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Seal size={28} />
                      <div>
                        <div className="card-cat">{s.category}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{s.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="filter-panel" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <SidebarAd />
            {related.length > 0 && (
              <div>
                <h4 style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 10 }}>
                  Related guides
                </h4>
                {related.map((a) => (
                  <Link key={a.id} href={`/blog/${a.slug}`} className="filter-opt" style={{ display: "block", lineHeight: 1.4, padding: "8px 0" }}>
                    {a.title}
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
