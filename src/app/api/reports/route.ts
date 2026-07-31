import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { query, queryOne, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await query(
    `SELECT r.*, s.name AS site_name FROM reports r
     LEFT JOIN sites s ON s.id = r.site_id
     ORDER BY r.created_at DESC`
  );
  return NextResponse.json({ reports: rows });
}

const schema = z.object({ siteId: z.string().min(1), note: z.string().optional() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const site = await queryOne("SELECT id FROM sites WHERE id = $1", [parsed.data.siteId]);
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const id = randomUUID();
  await run("INSERT INTO reports (id, site_id, note) VALUES ($1, $2, $3)", [
    id,
    parsed.data.siteId,
    parsed.data.note || null,
  ]);
  return NextResponse.json({ ok: true }, { status: 201 });
}
