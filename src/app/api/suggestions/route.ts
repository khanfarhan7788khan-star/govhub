import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = db.prepare("SELECT * FROM suggestions ORDER BY created_at DESC").all();
  return NextResponse.json({ suggestions: rows });
}

const schema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  category: z.string().min(1),
  note: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }
  const id = randomUUID();
  db.prepare("INSERT INTO suggestions (id, name, url, category, note) VALUES (?, ?, ?, ?, ?)").run(
    id,
    parsed.data.name,
    parsed.data.url,
    parsed.data.category,
    parsed.data.note || null
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}
