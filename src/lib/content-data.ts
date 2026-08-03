import { query, queryOne, run, ArticleRow, ServiceDetailRow, FaqRow, AnnouncementRow } from "./db";
import { Article, ServiceDetail, Faq, Announcement } from "./types";
import { parseBullets, parseFaqPairs, estimateReadingMinutes } from "./content";

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    tags: row.tags ? row.tags.split(",").filter(Boolean) : [],
    author: row.author,
    featured: !!row.featured,
    related_site_ids: row.related_site_ids ? row.related_site_ids.split(",").filter(Boolean) : [],
    views: row.views,
    published_date: row.published_date,
    updated_date: row.updated_date,
    reading_minutes: estimateReadingMinutes(row.content),
  };
}

function rowToServiceDetail(row: ServiceDetailRow): ServiceDetail {
  return {
    site_id: row.site_id,
    overview: row.overview,
    benefits: parseBullets(row.benefits),
    eligibility: parseBullets(row.eligibility),
    documents: parseBullets(row.documents),
    fees: row.fees,
    processing_time: row.processing_time,
    steps: parseBullets(row.steps),
    important_notes: row.important_notes,
    common_mistakes: parseBullets(row.common_mistakes),
    faqs: parseFaqPairs(row.faqs),
  };
}

function rowToFaq(row: FaqRow): Faq {
  return { id: row.id, question: row.question, answer: row.answer, sort_order: row.sort_order };
}

function rowToAnnouncement(row: AnnouncementRow): Announcement {
  return { id: row.id, title: row.title, body: row.body, level: row.level, active: !!row.active, created_at: row.created_at };
}

/* ---- Articles ---- */

export async function getAllArticles(): Promise<Article[]> {
  const rows = await query<ArticleRow>("SELECT * FROM articles ORDER BY published_date DESC");
  return rows.map(rowToArticle);
}

export async function getFeaturedArticles(limit = 4): Promise<Article[]> {
  const rows = await query<ArticleRow>(
    "SELECT * FROM articles WHERE featured = true ORDER BY published_date DESC LIMIT $1",
    [limit]
  );
  return rows.map(rowToArticle);
}

export async function getPopularArticles(limit = 5): Promise<Article[]> {
  const rows = await query<ArticleRow>("SELECT * FROM articles ORDER BY views DESC, published_date DESC LIMIT $1", [
    limit,
  ]);
  return rows.map(rowToArticle);
}

export async function searchArticles(params: { q?: string; category?: string; tag?: string }): Promise<Article[]> {
  let sql = "SELECT * FROM articles WHERE 1=1";
  const args: unknown[] = [];
  if (params.category) {
    args.push(params.category);
    sql += ` AND category = $${args.length}`;
  }
  if (params.tag) {
    args.push(`%${params.tag.toLowerCase()}%`);
    sql += ` AND lower(tags) LIKE $${args.length}`;
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    if (q) {
      args.push(`%${q}%`);
      const p = `$${args.length}`;
      sql += ` AND (lower(title) LIKE ${p} OR lower(excerpt) LIKE ${p} OR lower(tags) LIKE ${p} OR lower(category) LIKE ${p})`;
    }
  }
  sql += " ORDER BY published_date DESC";
  const rows = await query<ArticleRow>(sql, args);
  return rows.map(rowToArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await queryOne<ArticleRow>("SELECT * FROM articles WHERE slug = $1", [slug]);
  return row ? rowToArticle(row) : null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  const row = await queryOne<ArticleRow>("SELECT * FROM articles WHERE id = $1", [id]);
  return row ? rowToArticle(row) : null;
}

export async function getRelatedArticles(category: string, excludeId: string, limit = 3): Promise<Article[]> {
  const rows = await query<ArticleRow>(
    "SELECT * FROM articles WHERE category = $1 AND id != $2 ORDER BY published_date DESC LIMIT $3",
    [category, excludeId, limit]
  );
  return rows.map(rowToArticle);
}

export async function incrementArticleViews(id: string): Promise<void> {
  await run("UPDATE articles SET views = views + 1 WHERE id = $1", [id]);
}

export async function getArticleCategories(): Promise<{ category: string; count: number }[]> {
  const rows = await query<{ category: string; count: number }>(
    "SELECT category, COUNT(*)::int AS count FROM articles GROUP BY category ORDER BY category ASC"
  );
  return rows;
}

/* ---- Service details ---- */

export async function getServiceDetail(siteId: string): Promise<ServiceDetail | null> {
  const row = await queryOne<ServiceDetailRow>("SELECT * FROM service_details WHERE site_id = $1", [siteId]);
  return row ? rowToServiceDetail(row) : null;
}

/* ---- FAQs ---- */

export async function getAllFaqs(): Promise<Faq[]> {
  const rows = await query<FaqRow>("SELECT * FROM faqs ORDER BY sort_order ASC");
  return rows.map(rowToFaq);
}

/* ---- Announcements ---- */

export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const rows = await query<AnnouncementRow>(
    "SELECT * FROM announcements WHERE active = true ORDER BY created_at DESC"
  );
  return rows.map(rowToAnnouncement);
}
