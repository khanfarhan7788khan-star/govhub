import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db, SiteRow } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

function toClient(row: SiteRow) {
  return {
    ...row,
    featured: !!row.featured,
    languages: row.languages ? row.languages.split(",") : [],
    tags: row.tags ? row.tags.split(",") : [],
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "";
  const levels = searchParams.getAll("level");
  const sort = searchParams.get("sort") || "popular";
  const featuredOnly = searchParams.get("featured") === "1";

  let sql = "SELECT * FROM sites WHERE 1=1";
  const params: (string | number)[] = [];

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }
  if (levels.length) {
    sql += ` AND level IN (${levels.map(() => "?").join(",")})`;
    params.push(...levels);
  }
  if (featuredOnly) {
    sql += " AND featured = 1";
  }
  if (q) {
    sql += ` AND (
      lower(name) LIKE ? OR lower(description) LIKE ? OR
      lower(category) LIKE ? OR lower(ministry) LIKE ? OR lower(tags) LIKE ?
    )`;
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }

  if (sort === "az") sql += " ORDER BY name ASC";
  else if (sort === "recent") sql += " ORDER BY verified_date DESC";
  else sql += " ORDER BY featured DESC, name ASC";

  const rows = db.prepare(sql).all(...params) as SiteRow[];
  return NextResponse.json({ sites: rows.map(toClient), total: rows.length });
}

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  url: z.string().url(),
  category: z.string().min(1),
  ministry: z.string().min(1),
  state: z.string().nullable().optional(),
  level: z.enum(["Central", "State", "District"]),
  languages: z.array(z.string()).default(["English"]),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  verified_date: z.string().min(4),
});

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  const id = d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + randomUUID().slice(0, 6);

  db.prepare(`
    INSERT INTO sites (id, name, description, url, category, ministry, state, level, languages, tags, featured, verified_date)
    VALUES (@id, @name, @description, @url, @category, @ministry, @state, @level, @languages, @tags, @featured, @verified_date)
  `).run({
    id,
    name: d.name,
    description: d.description,
    url: d.url,
    category: d.category,
    ministry: d.ministry,
    state: d.state || null,
    level: d.level,
    languages: d.languages.join(","),
    tags: d.tags.join(","),
    featured: d.featured ? 1 : 0,
    verified_date: d.verified_date,
  });

  const row = db.prepare("SELECT * FROM sites WHERE id = ?").get(id) as SiteRow;
  return NextResponse.json({ site: toClient(row) }, { status: 201 });
}
