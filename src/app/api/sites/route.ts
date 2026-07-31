import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { query, queryOne, run, SiteRow } from "@/lib/db";
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
  const params: unknown[] = [];

  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (levels.length) {
    params.push(levels);
    sql += ` AND level = ANY($${params.length}::text[])`;
  }
  if (featuredOnly) {
    sql += " AND featured = true";
  }
  if (q) {
    params.push(`%${q}%`);
    const p = `$${params.length}`;
    sql += ` AND (
      lower(name) LIKE ${p} OR lower(description) LIKE ${p} OR
      lower(category) LIKE ${p} OR lower(ministry) LIKE ${p} OR lower(tags) LIKE ${p}
    )`;
  }

  if (sort === "az") sql += " ORDER BY name ASC";
  else if (sort === "recent") sql += " ORDER BY verified_date DESC";
  else sql += " ORDER BY featured DESC, name ASC";

  const rows = await query<SiteRow>(sql, params);
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

  await run(
    `INSERT INTO sites (id, name, description, url, category, ministry, state, level, languages, tags, featured, verified_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [id, d.name, d.description, d.url, d.category, d.ministry, d.state || null, d.level, d.languages.join(","), d.tags.join(","), d.featured, d.verified_date]
  );

  const row = await queryOne<SiteRow>("SELECT * FROM sites WHERE id = $1", [id]);
  return NextResponse.json({ site: toClient(row as SiteRow) }, { status: 201 });
}
