import { db, SiteRow } from "./db";
import { Site, Category } from "./types";

export function rowToSite(row: SiteRow): Site {
  return {
    ...row,
    featured: !!row.featured,
    languages: row.languages ? row.languages.split(",") : [],
    tags: row.tags ? row.tags.split(",") : [],
  };
}

export function getFeaturedSites(limit = 8): Site[] {
  const rows = db.prepare("SELECT * FROM sites WHERE featured = 1 ORDER BY name ASC LIMIT ?").all(limit) as SiteRow[];
  return rows.map(rowToSite);
}

export function getRecentSites(limit = 6): Site[] {
  const rows = db.prepare("SELECT * FROM sites ORDER BY verified_date DESC LIMIT ?").all(limit) as SiteRow[];
  return rows.map(rowToSite);
}

export function getCategoriesWithCounts(): Category[] {
  const cats = db.prepare("SELECT * FROM categories ORDER BY key ASC").all() as { id: string; key: string; icon: string }[];
  const counts = db.prepare("SELECT category, COUNT(*) AS c FROM sites GROUP BY category").all() as { category: string; c: number }[];
  const countMap = Object.fromEntries(counts.map((c) => [c.category, c.c]));
  return cats.map((c) => ({ ...c, count: countMap[c.key] || 0 }));
}

export function getStats() {
  const totalSites = (db.prepare("SELECT COUNT(*) AS c FROM sites").get() as { c: number }).c;
  const totalCats = (db.prepare("SELECT COUNT(*) AS c FROM categories").get() as { c: number }).c;
  const states = new Set(
    (db.prepare("SELECT DISTINCT state FROM sites WHERE state IS NOT NULL").all() as { state: string }[]).map((s) => s.state)
  );
  return {
    totalSites,
    totalCats,
    states: states.size || 28,
  };
}

export function searchSites(params: {
  q?: string;
  category?: string;
  levels?: string[];
  sort?: string;
}): Site[] {
  let sql = "SELECT * FROM sites WHERE 1=1";
  const args: (string | number)[] = [];

  if (params.category) {
    sql += " AND category = ?";
    args.push(params.category);
  }
  if (params.levels && params.levels.length) {
    sql += ` AND level IN (${params.levels.map(() => "?").join(",")})`;
    args.push(...params.levels);
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    if (q) {
      sql += ` AND (
        lower(name) LIKE ? OR lower(description) LIKE ? OR
        lower(category) LIKE ? OR lower(ministry) LIKE ? OR lower(tags) LIKE ?
      )`;
      const like = `%${q}%`;
      args.push(like, like, like, like, like);
    }
  }

  if (params.sort === "az") sql += " ORDER BY name ASC";
  else if (params.sort === "recent") sql += " ORDER BY verified_date DESC";
  else sql += " ORDER BY featured DESC, name ASC";

  const rows = db.prepare(sql).all(...args) as SiteRow[];
  return rows.map(rowToSite);
}

export function getSiteById(id: string): Site | null {
  const row = db.prepare("SELECT * FROM sites WHERE id = ?").get(id) as SiteRow | undefined;
  return row ? rowToSite(row) : null;
}

export function getRelatedSites(category: string, excludeId: string, limit = 3): Site[] {
  const rows = db.prepare("SELECT * FROM sites WHERE category = ? AND id != ? LIMIT ?").all(category, excludeId, limit) as SiteRow[];
  return rows.map(rowToSite);
}

export function getFavoriteIdSet(sessionId: string | undefined): Set<string> {
  if (!sessionId) return new Set();
  const rows = db.prepare("SELECT site_id FROM favorites WHERE session_id = ?").all(sessionId) as { site_id: string }[];
  return new Set(rows.map((r) => r.site_id));
}

export function getFavoriteSites(sessionId: string | undefined): Site[] {
  if (!sessionId) return [];
  const rows = db
    .prepare(
      `SELECT s.* FROM sites s JOIN favorites f ON f.site_id = s.id WHERE f.session_id = ? ORDER BY f.created_at DESC`
    )
    .all(sessionId) as SiteRow[];
  return rows.map(rowToSite);
}
