import { NextRequest, NextResponse } from "next/server";
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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await queryOne<SiteRow>("SELECT * FROM sites WHERE id = $1", [id]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const related = await query<SiteRow>("SELECT * FROM sites WHERE category = $1 AND id != $2 LIMIT 3", [
    row.category,
    row.id,
  ]);

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
  const existing = await queryOne<SiteRow>("SELECT * FROM sites WHERE id = $1", [id]);
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
    featured: d.featured !== undefined ? d.featured : existing.featured,
    verified_date: d.verified_date ?? existing.verified_date,
  };

  await run(
    `UPDATE sites SET name=$1, description=$2, url=$3, category=$4,
      ministry=$5, state=$6, level=$7, languages=$8, tags=$9,
      featured=$10, verified_date=$11, updated_at=now()
    WHERE id=$12`,
    [merged.name, merged.description, merged.url, merged.category, merged.ministry, merged.state, merged.level, merged.languages, merged.tags, merged.featured, merged.verified_date, id]
  );

  const row = await queryOne<SiteRow>("SELECT * FROM sites WHERE id = $1", [id]);
  return NextResponse.json({ site: toClient(row as SiteRow) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const info = await run("DELETE FROM sites WHERE id = $1", [id]);
  if (info.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
