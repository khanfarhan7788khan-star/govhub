import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { query, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  const rows = await query("SELECT * FROM faqs ORDER BY sort_order ASC");
  return NextResponse.json({ faqs: rows });
}

const schema = z.object({ question: z.string().min(3), answer: z.string().min(3), sort_order: z.number().default(0) });

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const id = randomUUID();
  await run("INSERT INTO faqs (id, question, answer, sort_order) VALUES ($1, $2, $3, $4)", [
    id,
    parsed.data.question,
    parsed.data.answer,
    parsed.data.sort_order,
  ]);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
