import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryOne, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

const schema = z.object({ status: z.enum(["approved", "rejected", "pending"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const suggestion = await queryOne<{ id: string; name: string; url: string; category: string; note: string | null }>(
    "SELECT * FROM suggestions WHERE id = $1",
    [id]
  );
  if (!suggestion) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await run("UPDATE suggestions SET status = $1 WHERE id = $2", [parsed.data.status, id]);

  if (parsed.data.status === "approved") {
    const siteId =
      suggestion.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + id.slice(0, 6);
    await run(
      `INSERT INTO sites (id, name, description, url, category, ministry, level, languages, tags, featured, verified_date)
       VALUES ($1, $2, $3, $4, $5, $6, 'Central', 'English', '', false, CURRENT_DATE)`,
      [
        siteId,
        suggestion.name,
        suggestion.note || "Suggested by a community member and approved by an admin.",
        suggestion.url,
        suggestion.category,
        "Unverified — added from a public suggestion",
      ]
    );
  }

  return NextResponse.json({ ok: true });
}
