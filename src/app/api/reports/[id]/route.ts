import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

const schema = z.object({ status: z.enum(["pending", "resolved"]) });

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const info = await run("UPDATE reports SET status = $1 WHERE id = $2", [parsed.data.status, id]);
  if (info.rowCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
