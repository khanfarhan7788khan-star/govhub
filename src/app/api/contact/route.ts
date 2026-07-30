import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(3),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
  }
  const id = randomUUID();
  db.prepare("INSERT INTO messages (id, name, email, message) VALUES (?, ?, ?, ?)").run(
    id,
    parsed.data.name,
    parsed.data.email,
    parsed.data.message
  );
  return NextResponse.json({ ok: true }, { status: 201 });
}
