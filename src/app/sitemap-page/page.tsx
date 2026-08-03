import Link from "next/link";
import { getCategoriesWithCounts } from "@/lib/sites";
import { getAllArticles } from "@/lib/content-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sitemap" };

export default async function SitemapPage() {
  const [categories, articles] = await Promise.all([getCategoriesWithCounts(), getAllArticles()]);

  return (
    <section className="wrap static-page" style={{ padding: "44px 24px 90px" }}>
      <h1 className="disp">Sitemap</h1>
      <p className="sub">Every page on GovHub, organised for easy browsing.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
        <div>
          <h2 className="disp" style={{ fontSize: 16 }}>Main pages</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <Link href="/">Home</Link>
            <Link href="/browse">Browse all portals</Link>
            <Link href="/blog">Guides &amp; articles</Link>
            <Link href="/guide">How to apply &amp; register</Link>
            <Link href="/favorites">Favourites</Link>
          </div>
        </div>

        <div>
          <h2 className="disp" style={{ fontSize: 16 }}>Categories</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {categories.map((c) => (
              <Link key={c.id} href={`/browse?category=${encodeURIComponent(c.key)}`}>
                {c.key}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="disp" style={{ fontSize: 16 }}>Guides</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {articles.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`}>
                {a.title}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="disp" style={{ fontSize: 16 }}>Company</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/suggest">Suggest a website</Link>
          </div>
        </div>

        <div>
          <h2 className="disp" style={{ fontSize: 16 }}>Legal</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/cookie-policy">Cookie policy</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
