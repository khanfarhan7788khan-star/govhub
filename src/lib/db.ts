import { Pool, QueryResultRow, types } from "pg";
import bcrypt from "bcryptjs";

// Return DATE/TIMESTAMP/TIMESTAMPTZ as plain strings, not JS Date objects —
// the rest of the app treats these as strings (e.g. `.slice(0, 10)`).
types.setTypeParser(1082, (v) => v); // date
types.setTypeParser(1114, (v) => v); // timestamp without time zone
types.setTypeParser(1184, (v) => v); // timestamp with time zone

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Fail loudly and early rather than letting every query throw a cryptic error later.
  console.error(
    "DATABASE_URL is not set. Create a Postgres database (e.g. at neon.tech), " +
      "then add DATABASE_URL to your .env.local (locally) or your host's environment variables (in production)."
  );
}

const needsSSL =
  !!connectionString &&
  !/localhost|127\.0\.0\.1/.test(connectionString) &&
  !/sslmode=disable/.test(connectionString);

declare global {
  var __govhubPool: Pool | undefined;
  var __govhubReady: Promise<void> | undefined;
}

const pool =
  global.__govhubPool ??
  new Pool({
    connectionString,
    ssl: needsSSL ? { rejectUnauthorized: false } : undefined,
    // Each serverless function instance gets its own pool, and many instances
    // can run concurrently — keep each pool small so a traffic spike doesn't
    // multiply into hundreds of open connections. If you're on Neon, use the
    // *pooled* connection string (hostname contains "-pooler") in production;
    // it routes through PgBouncer and tolerates far more concurrent clients
    // than a direct connection does. See README → "Deploying on Vercel".
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
if (process.env.NODE_ENV !== "production") global.__govhubPool = pool;

export async function query<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
  await ensureReady();
  const res = await pool.query<T>(sql, params);
  return res.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function run(sql: string, params: unknown[] = []): Promise<{ rowCount: number }> {
  await ensureReady();
  const res = await pool.query(sql, params);
  return { rowCount: res.rowCount ?? 0 };
}

function ensureReady(): Promise<void> {
  if (!global.__govhubReady) global.__govhubReady = migrateAndSeed();
  return global.__govhubReady;
}

async function migrateAndSeed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      icon TEXT NOT NULL DEFAULT 'building'
    );

    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      ministry TEXT NOT NULL,
      state TEXT,
      level TEXT NOT NULL DEFAULT 'Central',
      languages TEXT NOT NULL DEFAULT 'English',
      tags TEXT NOT NULL DEFAULT '',
      featured BOOLEAN NOT NULL DEFAULT false,
      verified_date DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS favorites (
      session_id TEXT NOT NULL,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (session_id, site_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  const { rows: adminCountRows } = await pool.query("SELECT COUNT(*)::int AS c FROM admins");
  if (adminCountRows[0].c === 0) {
    const hash = bcrypt.hashSync("Admin@123", 10);
    await pool.query(
  `INSERT INTO admins (id, email, password_hash)
   VALUES ($1, $2, $3)
   ON CONFLICT (id) DO NOTHING`,
  [
      "admin-1",
      "admin@govhub.in",
      hash,
    ]);
  }

  const { rows: catCountRows } = await pool.query("SELECT COUNT(*)::int AS c FROM categories");
  if (catCountRows[0].c === 0) {
    const cats: [string, string][] = [
      ["Aadhaar & Identity", "fingerprint"],
      ["PAN Card", "id"],
      ["Passport", "pin"],
      ["Income Tax", "landmark"],
      ["GST", "cash"],
      ["Banking", "bank"],
      ["UPI & Digital Payments", "wallet"],
      ["Education", "cap"],
      ["Scholarships", "cap"],
      ["Jobs & Recruitment", "brief"],
      ["Health", "heart"],
      ["Agriculture", "leaf"],
      ["Transport", "car"],
      ["Driving Licence", "car"],
      ["Police", "shield"],
      ["Courts", "scale"],
      ["Elections", "vote"],
      ["Business & MSME", "building"],
      ["Women & Child", "users"],
      ["Pension", "users"],
      ["Social Welfare", "users"],
      ["Utilities", "bolt"],
    ];
    for (const [key, icon] of cats) {
      await pool.query(
  `INSERT INTO categories (id, key, icon)
   VALUES ($1, $2, $3)
   ON CONFLICT (id) DO NOTHING`,
  [
        `cat-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        key,
        icon,
      ]);
    }
  }

  const { rows: siteCountRows } = await pool.query("SELECT COUNT(*)::int AS c FROM sites");
  if (siteCountRows[0].c === 0) {
    const sites: Omit<SiteRow, "created_at" | "updated_at">[] = [
      { id: "uidai", name: "UIDAI — Aadhaar", description: "Enrol for Aadhaar, update details, download your e-Aadhaar and verify authenticity.", url: "https://uidai.gov.in", category: "Aadhaar & Identity", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi,+21 regional", tags: "aadhaar,identity,uid", featured: true, verified_date: "2026-06-02" },
      { id: "incometax", name: "Income Tax e-Filing", description: "File income tax returns, check refund status, and manage PAN-linked tax records.", url: "https://www.incometax.gov.in", category: "Income Tax", ministry: "Ministry of Finance", state: null, level: "Central", languages: "English,Hindi", tags: "itr,tax,refund", featured: true, verified_date: "2026-07-11" },
      { id: "gst", name: "GST Portal", description: "Register for GST, file returns, generate e-way bills and track ARN status.", url: "https://www.gst.gov.in", category: "GST", ministry: "Ministry of Finance", state: null, level: "Central", languages: "English,Hindi", tags: "gst,returns,business", featured: true, verified_date: "2026-07-04" },
      { id: "passport", name: "Passport Seva", description: "Apply for a new passport, renewal, or police clearance certificate.", url: "https://www.passportindia.gov.in", category: "Passport", ministry: "Ministry of External Affairs", state: null, level: "Central", languages: "English,Hindi", tags: "passport,visa,travel", featured: true, verified_date: "2026-05-20" },
      { id: "digilocker", name: "DigiLocker", description: "A secure cloud locker for your government-issued documents and certificates.", url: "https://www.digilocker.gov.in", category: "Aadhaar & Identity", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "documents,locker,digital", featured: false, verified_date: "2026-06-18" },
      { id: "mygov", name: "MyGov India", description: "Participate in public consultations, quizzes and government campaigns.", url: "https://www.mygov.in", category: "Utilities", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "citizen engagement", featured: false, verified_date: "2026-04-29" },
      { id: "epfo", name: "EPFO Member Portal", description: "Check your provident fund balance, file claims, and update KYC.", url: "https://www.epfindia.gov.in", category: "Pension", ministry: "Ministry of Labour & Employment", state: null, level: "Central", languages: "English,Hindi", tags: "pf,pension,employment", featured: false, verified_date: "2026-07-09" },
      { id: "parivahan", name: "Parivahan Sewa", description: "Apply for or renew a driving licence, register vehicles, pay road tax.", url: "https://parivahan.gov.in", category: "Transport", ministry: "Ministry of Road Transport & Highways", state: null, level: "Central", languages: "English,Hindi", tags: "driving licence,vehicle,rto", featured: true, verified_date: "2026-07-01" },
      { id: "nrega", name: "MGNREGA", description: "Track job cards, wage payments and work demand under the rural employment scheme.", url: "https://nrega.nic.in", category: "Social Welfare", ministry: "Ministry of Rural Development", state: null, level: "Central", languages: "English,Hindi", tags: "employment,rural,wages", featured: false, verified_date: "2026-03-14" },
      { id: "pmkisan", name: "PM-KISAN", description: "Check instalment status of the income support scheme for farmers.", url: "https://pmkisan.gov.in", category: "Agriculture", ministry: "Ministry of Agriculture & Farmers Welfare", state: null, level: "Central", languages: "English,Hindi", tags: "farmer,subsidy", featured: false, verified_date: "2026-06-27" },
      { id: "scholarships", name: "National Scholarship Portal", description: "Apply for central and state scholarships in a single window.", url: "https://scholarships.gov.in", category: "Scholarships", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "scholarship,student", featured: false, verified_date: "2026-05-02" },
      { id: "nta", name: "National Testing Agency", description: "Registration and admit cards for JEE, NEET, UGC-NET and other national exams.", url: "https://nta.ac.in", category: "Education", ministry: "Ministry of Education", state: null, level: "Central", languages: "English,Hindi", tags: "exam,admit card", featured: false, verified_date: "2026-06-30" },
      { id: "upsc", name: "UPSC Online", description: "Apply for civil services, engineering services and other central recruitment exams.", url: "https://upsc.gov.in", category: "Jobs & Recruitment", ministry: "Union Public Service Commission", state: null, level: "Central", languages: "English,Hindi", tags: "recruitment,civil services", featured: true, verified_date: "2026-07-15" },
      { id: "npci", name: "NPCI — UPI", description: "Learn how UPI works and find the list of banks and apps that support it.", url: "https://www.npci.org.in", category: "UPI & Digital Payments", ministry: "Reserve Bank of India / NPCI", state: null, level: "Central", languages: "English", tags: "upi,payments", featured: false, verified_date: "2026-06-11" },
      { id: "eci", name: "Election Commission of India", description: "Check voter registration, download voter ID, and find your polling station.", url: "https://eci.gov.in", category: "Elections", ministry: "Election Commission of India", state: null, level: "Central", languages: "English,Hindi", tags: "voter id,elections", featured: false, verified_date: "2026-07-19" },
      { id: "ecourts", name: "eCourts Services", description: "Search case status, cause lists and court orders across Indian courts.", url: "https://ecourts.gov.in", category: "Courts", ministry: "Department of Justice", state: null, level: "Central", languages: "English,Hindi", tags: "case status,judiciary", featured: false, verified_date: "2026-05-26" },
      { id: "pmjay", name: "Ayushman Bharat — PM-JAY", description: "Check eligibility and find empanelled hospitals under India's health cover scheme.", url: "https://pmjay.gov.in", category: "Health", ministry: "Ministry of Health & Family Welfare", state: null, level: "Central", languages: "English,Hindi", tags: "health insurance,hospitals", featured: false, verified_date: "2026-06-05" },
      { id: "udyam", name: "Udyam Registration", description: "Register your business as a Micro, Small or Medium Enterprise.", url: "https://udyamregistration.gov.in", category: "Business & MSME", ministry: "Ministry of MSME", state: null, level: "Central", languages: "English,Hindi", tags: "msme,business registration", featured: false, verified_date: "2026-07-02" },
      { id: "indiaportal", name: "India.gov.in", description: "The national portal — a directory of schemes, services and ministries.", url: "https://www.india.gov.in", category: "Utilities", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "national portal", featured: false, verified_date: "2026-04-08" },
      { id: "pan-protean", name: "Protean eGov — PAN Services", description: "Apply for a new PAN card, correction, or reprint through the authorised registrar.", url: "https://www.protean-tinpan.com", category: "PAN Card", ministry: "Ministry of Finance", state: null, level: "Central", languages: "English", tags: "pan,tax id", featured: false, verified_date: "2026-05-30" },
      { id: "ncw", name: "National Commission for Women", description: "File a complaint or seek help regarding women's safety and rights.", url: "https://ncwapps.nic.in", category: "Women & Child", ministry: "Ministry of Women & Child Development", state: null, level: "Central", languages: "English,Hindi", tags: "women safety,complaint", featured: false, verified_date: "2026-04-22" },
      { id: "cybercrime", name: "National Cyber Crime Reporting Portal", description: "Report cyber crime, financial fraud, and online harassment.", url: "https://cybercrime.gov.in", category: "Police", ministry: "Ministry of Home Affairs", state: null, level: "Central", languages: "English,Hindi", tags: "fraud,cyber crime,police", featured: true, verified_date: "2026-07-06" },
      { id: "nps-cra", name: "National Pension System — CRA", description: "Manage your NPS account, view statements and make contributions.", url: "https://www.cra-nsdl.com", category: "Pension", ministry: "Pension Fund Regulatory & Development Authority", state: null, level: "Central", languages: "English", tags: "nps,retirement", featured: false, verified_date: "2026-05-15" },
    ];
    for (const s of sites) {
    await pool.query(
  `INSERT INTO sites (
      id,
      name,
      description,
      url,
      category,
      ministry,
      state,
      level,
      languages,
      tags,
      featured,
      verified_date,
      created_at,
      updated_at
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING`,
  [
    s.id,
    s.name,
    s.description,
    s.url,
    s.category,
    s.ministry,
    s.state,
    s.level,
    s.languages,
    s.tags,
    s.featured,
    s.verified_date,
  ]
);
    }
  }
}

export type SiteRow = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  ministry: string;
  state: string | null;
  level: string;
  languages: string;
  tags: string;
  featured: boolean;
  verified_date: string;
  created_at: string;
  updated_at: string;
};
