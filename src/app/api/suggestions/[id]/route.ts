import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

const schema = z.object({ status: z.enum(["approved", "rejected", "pending"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const suggestion = db.prepare("SELECT * FROM suggestions WHERE id = ?").get(id) as
    | { id: string; name: string; url: string; category: string; note: string | null }
    | undefined;
  if (!suggestion) return NextResponse.json({ error: "Not found" }, { status: 404 });

  db.prepare("UPDATE suggestions SET status = ? WHERE id = ?").run(parsed.data.status, id);

  if (parsed.data.status === "approved") {
    const siteId =
      suggestion.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + id.slice(0, 6);
    db.prepare(`
      INSERT INTO sites (id, name, description, url, category, ministry, level, languages, tags, featured, verified_date)
      VALUES (?, ?, ?, ?, ?, ?, 'Central', 'English', '', 0, date('now'))
    `).run(
      siteId,
      suggestion.name,
      suggestion.note || "Suggested by a community member and approved by an admin.",
      suggestion.url,
      suggestion.category,
      "Unverified — added from a public suggestion"
    );
  }

  return NextResponse.json({ ok: true });
}
