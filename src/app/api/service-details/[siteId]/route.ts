import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryOne, run } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const { siteId } = await params;
  const row = await queryOne("SELECT * FROM service_details WHERE site_id = $1", [siteId]);
  return NextResponse.json({ detail: row });
}

const schema = z.object({
  overview: z.string().default(""),
  benefits: z.string().default(""),
  eligibility: z.string().default(""),
  documents: z.string().default(""),
  fees: z.string().default(""),
  processing_time: z.string().default(""),
  steps: z.string().default(""),
  important_notes: z.string().default(""),
  common_mistakes: z.string().default(""),
  faqs: z.string().default(""),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ siteId: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { siteId } = await params;

  const site = await queryOne("SELECT id FROM sites WHERE id = $1", [siteId]);
  if (!site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const d = parsed.data;

  await run(
    `INSERT INTO service_details (site_id, overview, benefits, eligibility, documents, fees, processing_time, steps, important_notes, common_mistakes, faqs, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, now())
     ON CONFLICT (site_id) DO UPDATE SET
       overview=EXCLUDED.overview, benefits=EXCLUDED.benefits, eligibility=EXCLUDED.eligibility,
       documents=EXCLUDED.documents, fees=EXCLUDED.fees, processing_time=EXCLUDED.processing_time,
       steps=EXCLUDED.steps, important_notes=EXCLUDED.important_notes, common_mistakes=EXCLUDED.common_mistakes,
       faqs=EXCLUDED.faqs, updated_at=now()`,
    [siteId, d.overview, d.benefits, d.eligibility, d.documents, d.fees, d.processing_time, d.steps, d.important_notes, d.common_mistakes, d.faqs]
  );

  return NextResponse.json({ ok: true });
}
