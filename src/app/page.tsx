import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getFeaturedSites, getRecentSites, getCategoriesWithCounts, getStats, getFavoriteIdSet } from "@/lib/sites";
import { cookies } from "next/headers";
import SiteCard from "@/components/SiteCard";
import CategoryIcon from "@/components/CategoryIcon";
import HomeSearch from "@/components/HomeSearch";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const store = await cookies();
  const sid = store.get("govhub_sid")?.value;
  const favIds = getFavoriteIdSet(sid);

  const featured = getFeaturedSites();
  const recent = getRecentSites();
  const categories = getCategoriesWithCounts().slice(0, 12);
  const stats = getStats();

  const statList = [
    { n: String(stats.totalSites), l: "Verified websites" },
    { n: String(stats.totalCats), l: "Categories" },
    { n: String(stats.states), l: "States covered" },
    { n: "9,180", l: "Checked this month" },
  ];

  return (
    <>
      <section className="wrap" style={{ padding: "64px 24px 40px" }}>
        <span className="eyebrow">AN INDEPENDENT DIRECTORY</span>
        <h1 className="disp" style={{ fontSize: "clamp(32px,5vw,54px)", lineHeight: 1.05, fontWeight: 600, maxWidth: 780, letterSpacing: "-0.5px" }}>
          Find any official government website,{" "}
          <em style={{ fontStyle: "italic", color: "var(--saffron)" }}>without the guesswork.</em>
        </h1>
        <p style={{ color: "var(--ink-soft)", fontSize: 16, maxWidth: 580, marginTop: 16 }}>
          Every listing here is checked against the department&apos;s own domain before it&apos;s added — so you land on the real
          portal, not a lookalike.
        </p>

        <HomeSearch />

        <div className="stat-grid" style={{ marginTop: 46, maxWidth: 720 }}>
          {statList.map((s) => (
            <div key={s.l}>
              <div className="stat-num disp">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "8px 24px 48px" }}>
        <div className="section-head">
          <h2 className="disp">Browse by category</h2>
        </div>
        <div className="cat-grid">
          {categories.map((c) => (
            <Link key={c.id} href={`/browse?category=${encodeURIComponent(c.key)}`} className="cat-tile">
              <CategoryIcon icon={c.icon} size={20} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{c.key}</div>
                <div className="n mono">{c.count} listed</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 24px 48px" }}>
        <div className="section-head">
          <h2 className="disp">Most visited portals</h2>
          <Link className="linkmore" href="/browse">
            See all <ChevronRight size={13} />
          </Link>
        </div>
        <div className="card-grid">
          {featured.map((s) => (
            <SiteCard key={s.id} site={s} initiallySaved={favIds.has(s.id)} />
          ))}
        </div>
      </section>

      <section className="wrap" style={{ padding: "0 24px 90px" }}>
        <div className="section-head">
          <h2 className="disp">Recently verified</h2>
        </div>
        <div className="card-grid">
          {recent.map((s) => (
            <SiteCard key={s.id} site={s} initiallySaved={favIds.has(s.id)} />
          ))}
        </div>
      </section>
    </>
  );
}
