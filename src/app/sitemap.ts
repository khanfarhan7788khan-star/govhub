import { MetadataRoute } from "next";
import { query } from "@/lib/db";
import { SiteRow, ArticleRow } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://govhub.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/browse`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guide`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/suggest`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookie-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/sitemap-page`, changeFrequency: "monthly", priority: 0.3 },
  ];

  let sites: SiteRow[] = [];
  let articles: ArticleRow[] = [];
  try {
    [sites, articles] = await Promise.all([
      query<SiteRow>("SELECT id, updated_at FROM sites"),
      query<ArticleRow>("SELECT slug, updated_date FROM articles"),
    ]);
  } catch {
    // If the database isn't reachable at build/export time, still return the static pages.
    return staticPages;
  }

  const sitePages: MetadataRoute.Sitemap = sites.map((s) => ({
    url: `${SITE_URL}/site/${s.id}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/blog/${a.slug}`,
    lastModified: a.updated_date ? new Date(a.updated_date) : undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...sitePages, ...articlePages];
}
