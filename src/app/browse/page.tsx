import { Suspense } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { searchSites, getCategoriesWithCounts, getFavoriteIdSet } from "@/lib/sites";
import SiteCard from "@/components/SiteCard";
import { BrowseSearchBox, LevelFilter, SortSelect } from "@/components/BrowseControls";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function BrowsePage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  const category = typeof sp.category === "string" ? sp.category : "";
  const levels = Array.isArray(sp.level) ? sp.level : sp.level ? [sp.level] : [];
  const sort = typeof sp.sort === "string" ? sp.sort : "popular";

  const store = await cookies();
  const sid = store.get("govhub_sid")?.value;

  const [favIds, results, categories] = await Promise.all([
    getFavoriteIdSet(sid),
    searchSites({ q, category, levels, sort }),
    getCategoriesWithCounts(),
  ]);

  return (
    <section className="wrap" style={{ padding: "36px 24px 90px" }}>
      <Suspense>
        <BrowseSearchBox />
      </Suspense>

      <div className="browse-layout">
        <aside className="filter-panel">
          <Suspense>
            <LevelFilter />
          </Suspense>
          <div className="filter-group">
            <h4>Category</h4>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/browse?category=${encodeURIComponent(c.key)}`}
                  className="filter-opt"
                  style={category === c.key ? { color: "var(--saffron)", fontWeight: 600 } : undefined}
                >
                  {c.key}
                </Link>
              ))}
            </div>
          </div>
          <Suspense>
            <SortSelect />
          </Suspense>
        </aside>

        <div>
          <div className="section-head">
            <h2 className="disp">{category || (q ? `Results for "${q}"` : "All portals")}</h2>
            <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>
              {results.length} listing{results.length !== 1 ? "s" : ""}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="empty">
              <p>No verified listing matches that search.</p>
              <p style={{ marginTop: 8, fontSize: 13 }}>
                Try a different term, or <Link href="/suggest">suggest this website</Link> for review.
              </p>
            </div>
          ) : (
            <div className="card-grid fade-in">
              {results.map((s) => (
                <SiteCard key={s.id} site={s} initiallySaved={favIds.has(s.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
