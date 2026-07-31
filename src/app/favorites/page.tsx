import Link from "next/link";
import { cookies } from "next/headers";
import { getFavoriteSites } from "@/lib/sites";
import SiteCard from "@/components/SiteCard";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const store = await cookies();
  const sid = store.get("govhub_sid")?.value;
  const favorites = await getFavoriteSites(sid);

  return (
    <section className="wrap" style={{ padding: "36px 24px 90px" }}>
      <div className="section-head">
        <h2 className="disp" style={{ fontSize: 24 }}>Your favourites</h2>
      </div>
      <p style={{ color: "var(--ink-soft)", fontSize: 13.5, marginBottom: 20 }}>
        Saved on this browser — tied to a private session cookie, not an account.
      </p>
      {favorites.length === 0 ? (
        <div className="empty">
          <p>No favourites yet.</p>
          <p style={{ marginTop: 8, fontSize: 13 }}>
            <Link href="/browse">Browse the directory</Link> and tap the bookmark icon to save a portal.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {favorites.map((s) => (
            <SiteCard key={s.id} site={s} initiallySaved={true} />
          ))}
        </div>
      )}
    </section>
  );
}
