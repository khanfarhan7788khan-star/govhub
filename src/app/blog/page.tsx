import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  searchArticles,
  getFeaturedArticles,
  getPopularArticles,
  getArticleCategories,
} from "@/lib/content-data";
import ArticleCard from "@/components/ArticleCard";
import BlogSearchBox from "@/components/BlogSearchBox";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guides & Articles — GovHub Blog",
  description:
    "In-depth, plain-language guides to Indian government services — PAN card, Aadhaar, passport, driving licence, PM-KISAN, and more.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Guides & Articles — GovHub Blog",
    description: "In-depth, plain-language guides to Indian government services.",
    type: "website",
  },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";

  const [results, featured, popular, categories] = await Promise.all([
    searchArticles({ q, category }),
    getFeaturedArticles(),
    getPopularArticles(5),
    getArticleCategories(),
  ]);

  const showLanding = !q && !category;

  return (
    <section className="wrap" style={{ padding: "36px 24px 90px" }}>
      <div style={{ marginBottom: 30 }}>
        <span className="eyebrow">GOVHUB GUIDES</span>
        <h1 className="disp" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 600, letterSpacing: "-0.5px" }}>
          Plain-language guides to government services
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 15, maxWidth: 620, marginTop: 10 }}>
          Step-by-step walkthroughs for applying, renewing, and troubleshooting the services people search for most.
        </p>
      </div>

      <Suspense>
        <BlogSearchBox />
      </Suspense>

      <div className="browse-layout">
        <aside className="filter-panel">
          <div className="filter-group">
            <h4>Category</h4>
            {categories.map((c) => (
              <Link
                key={c.category}
                href={`/blog?category=${encodeURIComponent(c.category)}`}
                className="filter-opt"
                style={category === c.category ? { color: "var(--saffron)", fontWeight: 600 } : undefined}
              >
                {c.category} <span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>({c.count})</span>
              </Link>
            ))}
          </div>
          <div className="filter-group">
            <h4>Popular posts</h4>
            {popular.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`} className="filter-opt" style={{ display: "block", lineHeight: 1.4, padding: "8px 0" }}>
                {a.title}
              </Link>
            ))}
          </div>
        </aside>

        <div>
          {showLanding && featured.length > 0 && (
            <div style={{ marginBottom: 40 }}>
              <div className="section-head">
                <h2 className="disp">Featured guides</h2>
              </div>
              <div className="card-grid">
                {featured.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          )}

          <div className="section-head">
            <h2 className="disp">{category || (q ? `Results for "${q}"` : "All articles")}</h2>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              {results.length} article{results.length !== 1 ? "s" : ""}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <p>No articles match that search yet.</p>
              <p style={{ marginTop: 8, fontSize: 13 }}>
                Try a different term, or <Link href="/contact">let us know</Link> what guide you&apos;d find useful.
              </p>
            </div>
          ) : (
            <div className="card-grid fade-in">
              {results.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
