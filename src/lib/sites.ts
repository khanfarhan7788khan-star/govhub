import { query, queryOne, SiteRow } from "./db";
import { Site, Category } from "./types";

export function rowToSite(row: SiteRow): Site {
  return {
    ...row,
    featured: !!row.featured,
    languages: row.languages ? row.languages.split(",") : [],
    tags: row.tags ? row.tags.split(",") : [],
  };
}

export async function getFeaturedSites(limit = 8): Promise<Site[]> {
  const rows = await query<SiteRow>("SELECT * FROM sites WHERE featured = true ORDER BY name ASC LIMIT $1", [limit]);
  return rows.map(rowToSite);
}

export async function getRecentSites(limit = 6): Promise<Site[]> {
  const rows = await query<SiteRow>("SELECT * FROM sites ORDER BY verified_date DESC LIMIT $1", [limit]);
  return rows.map(rowToSite);
}

export async function getCategoriesWithCounts(): Promise<Category[]> {
  const cats = await query<{ id: string; key: string; icon: string }>("SELECT * FROM categories ORDER BY key ASC");
  const counts = await query<{ category: string; c: number }>(
    "SELECT category, COUNT(*)::int AS c FROM sites GROUP BY category"
  );
  const countMap = Object.fromEntries(counts.map((c) => [c.category, c.c]));
  return cats.map((c) => ({ ...c, count: countMap[c.key] || 0 }));
}

export async function getStats() {
  const totalRow = await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM sites");
  const catRow = await queryOne<{ c: number }>("SELECT COUNT(*)::int AS c FROM categories");
  const stateRows = await query<{ state: string }>("SELECT DISTINCT state FROM sites WHERE state IS NOT NULL");
  return {
    totalSites: totalRow?.c ?? 0,
    totalCats: catRow?.c ?? 0,
    states: stateRows.length || 28,
  };
}

export async function searchSites(params: {
  q?: string;
  category?: string;
  levels?: string[];
  sort?: string;
}): Promise<Site[]> {
  let sql = "SELECT * FROM sites WHERE 1=1";
  const args: unknown[] = [];

  if (params.category) {
    args.push(params.category);
    sql += ` AND category = $${args.length}`;
  }
  if (params.levels && params.levels.length) {
    args.push(params.levels);
    sql += ` AND level = ANY($${args.length}::text[])`;
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    if (q) {
      args.push(`%${q}%`);
      const p = `$${args.length}`;
      sql += ` AND (
        lower(name) LIKE ${p} OR lower(description) LIKE ${p} OR
        lower(category) LIKE ${p} OR lower(ministry) LIKE ${p} OR lower(tags) LIKE ${p}
      )`;
    }
  }

  if (params.sort === "az") sql += " ORDER BY name ASC";
  else if (params.sort === "recent") sql += " ORDER BY verified_date DESC";
  else sql += " ORDER BY featured DESC, name ASC";

  const rows = await query<SiteRow>(sql, args);
  return rows.map(rowToSite);
}

export async function getSiteById(id: string): Promise<Site | null> {
  const row = await queryOne<SiteRow>("SELECT * FROM sites WHERE id = $1", [id]);
  return row ? rowToSite(row) : null;
}

export async function getRelatedSites(category: string, excludeId: string, limit = 3): Promise<Site[]> {
  const rows = await query<SiteRow>("SELECT * FROM sites WHERE category = $1 AND id != $2 LIMIT $3", [
    category,
    excludeId,
    limit,
  ]);
  return rows.map(rowToSite);
}

export async function getFavoriteIdSet(sessionId: string | undefined): Promise<Set<string>> {
  if (!sessionId) return new Set();
  const rows = await query<{ site_id: string }>("SELECT site_id FROM favorites WHERE session_id = $1", [sessionId]);
  return new Set(rows.map((r) => r.site_id));
}

export async function getFavoriteSites(sessionId: string | undefined): Promise<Site[]> {
  if (!sessionId) return [];
  const rows = await query<SiteRow>(
    `SELECT s.* FROM sites s JOIN favorites f ON f.site_id = s.id WHERE f.session_id = $1 ORDER BY f.created_at DESC`,
    [sessionId]
  );
  return rows.map(rowToSite);
}
