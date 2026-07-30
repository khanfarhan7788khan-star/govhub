import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const cats = db.prepare("SELECT * FROM categories ORDER BY key ASC").all() as { id: string; key: string; icon: string }[];
  const counts = db
    .prepare("SELECT category, COUNT(*) AS c FROM sites GROUP BY category")
    .all() as { category: string; c: number }[];
  const countMap = Object.fromEntries(counts.map((c) => [c.category, c.c]));
  return NextResponse.json({
    categories: cats.map((c) => ({ ...c, count: countMap[c.key] || 0 })),
  });
}

const schema = z.object({ key: z.string().min(2), icon: z.string().default("building") });

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const id = "cat-" + parsed.data.key.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + randomUUID().slice(0, 4);
  try {
    db.prepare("INSERT INTO categories (id, key, icon) VALUES (?, ?, ?)").run(id, parsed.data.key, parsed.data.icon);
  } catch {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const info = db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  if (info.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
