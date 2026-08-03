import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

const schema = z.object({
  question: z.string().min(3).optional(),
  answer: z.string().min(3).optional(),
  sort_order: z.number().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const sets: string[] = [];
  const args: unknown[] = [];
  if (parsed.data.question !== undefined) { args.push(parsed.data.question); sets.push(`question=$${args.length}`); }
  if (parsed.data.answer !== undefined) { args.push(parsed.data.answer); sets.push(`answer=$${args.length}`); }
  if (parsed.data.sort_order !== undefined) { args.push(parsed.data.sort_order); sets.push(`sort_order=$${args.length}`); }
  if (sets.length === 0) return NextResponse.json({ ok: true });
  args.push(id);
  await run(`UPDATE faqs SET ${sets.join(", ")} WHERE id=$${args.length}`, args);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const info = await run("DELETE FROM faqs WHERE id = $1", [id]);
  if (info.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
