import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { query, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const category = searchParams.get("category") || "";

  let sql = "SELECT * FROM articles WHERE 1=1";
  const params: unknown[] = [];
  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    const p = `$${params.length}`;
    sql += ` AND (lower(title) LIKE ${p} OR lower(excerpt) LIKE ${p} OR lower(tags) LIKE ${p})`;
  }
  sql += " ORDER BY published_date DESC";

  const rows = await query(sql, params);
  return NextResponse.json({ articles: rows });
}

const schema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(50),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().default("GovHub Editorial Team"),
  featured: z.boolean().default(false),
  related_site_ids: z.array(z.string()).default([]),
  published_date: z.string().min(4),
});

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });

  const d = parsed.data;
  const slug = d.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const id = "art-" + slug.slice(0, 40) + "-" + Date.now().toString(36).slice(-5);
  const today = new Date().toISOString().slice(0, 10);

  try {
    await run(
      `INSERT INTO articles (id, slug, title, excerpt, content, category, tags, author, featured, related_site_ids, published_date, updated_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [id, slug, d.title, d.excerpt, d.content, d.category, d.tags.join(","), d.author, d.featured, d.related_site_ids.join(","), d.published_date, today]
    );
  } catch {
    return NextResponse.json({ error: "An article with a similar title already exists" }, { status: 409 });
  }

  return NextResponse.json({ ok: true, id, slug }, { status: 201 });
}
