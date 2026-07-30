import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db, SiteRow } from "@/lib/db";
import { getSessionId } from "@/lib/session";

function toClient(row: SiteRow) {
  return {
    ...row,
    featured: !!row.featured,
    languages: row.languages ? row.languages.split(",") : [],
    tags: row.tags ? row.tags.split(",") : [],
  };
}

export async function GET() {
  const sid = await getSessionId();
  const rows = db
    .prepare(
      `SELECT s.* FROM sites s
       JOIN favorites f ON f.site_id = s.id
       WHERE f.session_id = ?
       ORDER BY f.created_at DESC`
    )
    .all(sid) as SiteRow[];
  return NextResponse.json({ favorites: rows.map(toClient) });
}

const schema = z.object({ siteId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const sid = await getSessionId();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const site = db.prepare("SELECT id FROM sites WHERE id = ?").get(parsed.data.siteId);
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  db.prepare("INSERT OR IGNORE INTO favorites (session_id, site_id) VALUES (?, ?)").run(sid, parsed.data.siteId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const sid = await getSessionId();
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get("siteId");
  if (!siteId) return NextResponse.json({ error: "siteId required" }, { status: 400 });

  db.prepare("DELETE FROM favorites WHERE session_id = ? AND site_id = ?").run(sid, siteId);
  return NextResponse.json({ ok: true });
}
