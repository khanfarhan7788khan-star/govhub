import { NextRequest, NextResponse } from "next/server";
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = db.prepare("SELECT * FROM sites WHERE id = ?").get(id) as SiteRow | undefined;
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const related = db
    .prepare("SELECT * FROM sites WHERE category = ? AND id != ? LIMIT 3")
    .all(row.category, row.id) as SiteRow[];

  return NextResponse.json({ site: toClient(row), related: related.map(toClient) });
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  url: z.string().url().optional(),
  category: z.string().min(1).optional(),
  ministry: z.string().min(1).optional(),
  state: z.string().nullable().optional(),
  level: z.enum(["Central", "State", "District"]).optional(),
  languages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  verified_date: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = db.prepare("SELECT * FROM sites WHERE id = ?").get(id) as SiteRow | undefined;
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;

  const merged = {
    name: d.name ?? existing.name,
    description: d.description ?? existing.description,
    url: d.url ?? existing.url,
    category: d.category ?? existing.category,
    ministry: d.ministry ?? existing.ministry,
    state: d.state !== undefined ? d.state : existing.state,
    level: d.level ?? existing.level,
    languages: d.languages ? d.languages.join(",") : existing.languages,
    tags: d.tags ? d.tags.join(",") : existing.tags,
    featured: d.featured !== undefined ? (d.featured ? 1 : 0) : existing.featured,
    verified_date: d.verified_date ?? existing.verified_date,
  };

  db.prepare(`
    UPDATE sites SET name=@name, description=@description, url=@url, category=@category,
      ministry=@ministry, state=@state, level=@level, languages=@languages, tags=@tags,
      featured=@featured, verified_date=@verified_date, updated_at=datetime('now')
    WHERE id=@id
  `).run({ ...merged, id });

  const row = db.prepare("SELECT * FROM sites WHERE id = ?").get(id) as SiteRow;
  return NextResponse.json({ site: toClient(row) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const info = db.prepare("DELETE FROM sites WHERE id = ?").run(id);
  if (info.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
