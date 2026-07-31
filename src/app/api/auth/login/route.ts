import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { queryOne } from "@/lib/db";
import { signAdminToken, ADMIN_COOKIE } from "@/lib/auth";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const admin = await queryOne<{ id: string; email: string; password_hash: string }>(
    "SELECT * FROM admins WHERE email = $1",
    [parsed.data.email.toLowerCase()]
  );

  if (!admin || !bcrypt.compareSync(parsed.data.password, admin.password_hash)) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const token = signAdminToken({ sub: admin.id, email: admin.email });
  const res = NextResponse.json({ ok: true, email: admin.email });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
