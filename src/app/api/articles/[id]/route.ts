import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryOne, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await queryOne("SELECT * FROM articles WHERE id = $1", [id]);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ article: row });
}

const schema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().min(10).optional(),
  content: z.string().min(50).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  featured: z.boolean().optional(),
  related_site_ids: z.array(z.string()).optional(),
  published_date: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await queryOne<{
    title: string; excerpt: string; content: string; category: string; tags: string;
    author: string; featured: boolean; related_site_ids: string; published_date: string;
  }>("SELECT * FROM articles WHERE id = $1", [id]);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;
  const today = new Date().toISOString().slice(0, 10);

  const merged = {
    title: d.title ?? existing.title,
    excerpt: d.excerpt ?? existing.excerpt,
    content: d.content ?? existing.content,
    category: d.category ?? existing.category,
    tags: d.tags ? d.tags.join(",") : existing.tags,
    author: d.author ?? existing.author,
    featured: d.featured !== undefined ? d.featured : existing.featured,
    related_site_ids: d.related_site_ids ? d.related_site_ids.join(",") : existing.related_site_ids,
    published_date: d.published_date ?? existing.published_date,
  };

  await run(
    `UPDATE articles SET title=$1, excerpt=$2, content=$3, category=$4, tags=$5, author=$6,
      featured=$7, related_site_ids=$8, published_date=$9, updated_date=$10, updated_at=now()
     WHERE id=$11`,
    [merged.title, merged.excerpt, merged.content, merged.category, merged.tags, merged.author, merged.featured, merged.related_site_ids, merged.published_date, today, id]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const info = await run("DELETE FROM articles WHERE id = $1", [id]);
  if (info.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
