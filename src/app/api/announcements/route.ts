import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { query, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = await getCurrentAdmin();
  const activeOnly = searchParams.get("active") === "1" || !admin;
  const rows = activeOnly
    ? await query("SELECT * FROM announcements WHERE active = true ORDER BY created_at DESC")
    : await query("SELECT * FROM announcements ORDER BY created_at DESC");
  return NextResponse.json({ announcements: rows });
}

const schema = z.object({
  title: z.string().min(3),
  body: z.string().min(3),
  level: z.enum(["info", "warning", "success"]).default("info"),
  active: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const id = randomUUID();
  await run("INSERT INTO announcements (id, title, body, level, active) VALUES ($1, $2, $3, $4, $5)", [
    id,
    parsed.data.title,
    parsed.data.body,
    parsed.data.level,
    parsed.data.active,
  ]);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
