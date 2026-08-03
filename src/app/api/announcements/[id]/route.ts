import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(3).optional(),
  body: z.string().min(3).optional(),
  level: z.enum(["info", "warning", "success"]).optional(),
  active: z.boolean().optional(),
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
  if (parsed.data.title !== undefined) { args.push(parsed.data.title); sets.push(`title=$${args.length}`); }
  if (parsed.data.body !== undefined) { args.push(parsed.data.body); sets.push(`body=$${args.length}`); }
  if (parsed.data.level !== undefined) { args.push(parsed.data.level); sets.push(`level=$${args.length}`); }
  if (parsed.data.active !== undefined) { args.push(parsed.data.active); sets.push(`active=$${args.length}`); }
  if (sets.length === 0) return NextResponse.json({ ok: true });
  args.push(id);
  await run(`UPDATE announcements SET ${sets.join(", ")} WHERE id=$${args.length}`, args);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const info = await run("DELETE FROM announcements WHERE id = $1", [id]);
  if (info.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
