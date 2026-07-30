import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "govhub.db");

declare global {
  var __govhubDb: DatabaseSync | undefined;
}

function createConnection() {
  const conn = new DatabaseSync(DB_PATH);
  conn.exec("PRAGMA journal_mode = WAL");
  conn.exec("PRAGMA foreign_keys = ON");
  return conn;
}

export const db = global.__govhubDb ?? createConnection();
if (process.env.NODE_ENV !== "production") global.__govhubDb = db;

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
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
      featured INTEGER NOT NULL DEFAULT 0,
      verified_date TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      session_id TEXT NOT NULL,
      site_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (session_id, site_id),
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
    );
  `);
}

function seed() {
  const adminCount = (db.prepare("SELECT COUNT(*) AS c FROM admins").get() as { c: number }).c;
  if (adminCount === 0) {
    const hash = bcrypt.hashSync("Admin@123", 10);
    db.prepare("INSERT INTO admins (id, email, password_hash) VALUES (?, ?, ?)").run(
      "admin-1",
      "admin@govhub.in",
      hash
    );
  }

  const catCount = (db.prepare("SELECT COUNT(*) AS c FROM categories").get() as { c: number }).c;
  if (catCount === 0) {
    const insertCat = db.prepare("INSERT INTO categories (id, key, icon) VALUES (?, ?, ?)");
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
    db.exec("BEGIN");
    try {
      for (const [key, icon] of cats) insertCat.run(`cat-${key.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, key, icon);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }

  const siteCount = (db.prepare("SELECT COUNT(*) AS c FROM sites").get() as { c: number }).c;
  if (siteCount === 0) {
    const insertSite = db.prepare(`
      INSERT INTO sites (id, name, description, url, category, ministry, state, level, languages, tags, featured, verified_date)
      VALUES (@id, @name, @description, @url, @category, @ministry, @state, @level, @languages, @tags, @featured, @verified_date)
    `);
    const sites = [
      { id: "uidai", name: "UIDAI — Aadhaar", description: "Enrol for Aadhaar, update details, download your e-Aadhaar and verify authenticity.", url: "https://uidai.gov.in", category: "Aadhaar & Identity", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi,+21 regional", tags: "aadhaar,identity,uid", featured: 1, verified_date: "2026-06-02" },
      { id: "incometax", name: "Income Tax e-Filing", description: "File income tax returns, check refund status, and manage PAN-linked tax records.", url: "https://www.incometax.gov.in", category: "Income Tax", ministry: "Ministry of Finance", state: null, level: "Central", languages: "English,Hindi", tags: "itr,tax,refund", featured: 1, verified_date: "2026-07-11" },
      { id: "gst", name: "GST Portal", description: "Register for GST, file returns, generate e-way bills and track ARN status.", url: "https://www.gst.gov.in", category: "GST", ministry: "Ministry of Finance", state: null, level: "Central", languages: "English,Hindi", tags: "gst,returns,business", featured: 1, verified_date: "2026-07-04" },
      { id: "passport", name: "Passport Seva", description: "Apply for a new passport, renewal, or police clearance certificate.", url: "https://www.passportindia.gov.in", category: "Passport", ministry: "Ministry of External Affairs", state: null, level: "Central", languages: "English,Hindi", tags: "passport,visa,travel", featured: 1, verified_date: "2026-05-20" },
      { id: "digilocker", name: "DigiLocker", description: "A secure cloud locker for your government-issued documents and certificates.", url: "https://www.digilocker.gov.in", category: "Aadhaar & Identity", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "documents,locker,digital", featured: 0, verified_date: "2026-06-18" },
      { id: "mygov", name: "MyGov India", description: "Participate in public consultations, quizzes and government campaigns.", url: "https://www.mygov.in", category: "Utilities", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "citizen engagement", featured: 0, verified_date: "2026-04-29" },
      { id: "epfo", name: "EPFO Member Portal", description: "Check your provident fund balance, file claims, and update KYC.", url: "https://www.epfindia.gov.in", category: "Pension", ministry: "Ministry of Labour & Employment", state: null, level: "Central", languages: "English,Hindi", tags: "pf,pension,employment", featured: 0, verified_date: "2026-07-09" },
      { id: "parivahan", name: "Parivahan Sewa", description: "Apply for or renew a driving licence, register vehicles, pay road tax.", url: "https://parivahan.gov.in", category: "Transport", ministry: "Ministry of Road Transport & Highways", state: null, level: "Central", languages: "English,Hindi", tags: "driving licence,vehicle,rto", featured: 1, verified_date: "2026-07-01" },
      { id: "nrega", name: "MGNREGA", description: "Track job cards, wage payments and work demand under the rural employment scheme.", url: "https://nrega.nic.in", category: "Social Welfare", ministry: "Ministry of Rural Development", state: null, level: "Central", languages: "English,Hindi", tags: "employment,rural,wages", featured: 0, verified_date: "2026-03-14" },
      { id: "pmkisan", name: "PM-KISAN", description: "Check instalment status of the income support scheme for farmers.", url: "https://pmkisan.gov.in", category: "Agriculture", ministry: "Ministry of Agriculture & Farmers Welfare", state: null, level: "Central", languages: "English,Hindi", tags: "farmer,subsidy", featured: 0, verified_date: "2026-06-27" },
      { id: "scholarships", name: "National Scholarship Portal", description: "Apply for central and state scholarships in a single window.", url: "https://scholarships.gov.in", category: "Scholarships", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "scholarship,student", featured: 0, verified_date: "2026-05-02" },
      { id: "nta", name: "National Testing Agency", description: "Registration and admit cards for JEE, NEET, UGC-NET and other national exams.", url: "https://nta.ac.in", category: "Education", ministry: "Ministry of Education", state: null, level: "Central", languages: "English,Hindi", tags: "exam,admit card", featured: 0, verified_date: "2026-06-30" },
      { id: "upsc", name: "UPSC Online", description: "Apply for civil services, engineering services and other central recruitment exams.", url: "https://upsc.gov.in", category: "Jobs & Recruitment", ministry: "Union Public Service Commission", state: null, level: "Central", languages: "English,Hindi", tags: "recruitment,civil services", featured: 1, verified_date: "2026-07-15" },
      { id: "npci", name: "NPCI — UPI", description: "Learn how UPI works and find the list of banks and apps that support it.", url: "https://www.npci.org.in", category: "UPI & Digital Payments", ministry: "Reserve Bank of India / NPCI", state: null, level: "Central", languages: "English", tags: "upi,payments", featured: 0, verified_date: "2026-06-11" },
      { id: "eci", name: "Election Commission of India", description: "Check voter registration, download voter ID, and find your polling station.", url: "https://eci.gov.in", category: "Elections", ministry: "Election Commission of India", state: null, level: "Central", languages: "English,Hindi", tags: "voter id,elections", featured: 0, verified_date: "2026-07-19" },
      { id: "ecourts", name: "eCourts Services", description: "Search case status, cause lists and court orders across Indian courts.", url: "https://ecourts.gov.in", category: "Courts", ministry: "Department of Justice", state: null, level: "Central", languages: "English,Hindi", tags: "case status,judiciary", featured: 0, verified_date: "2026-05-26" },
      { id: "pmjay", name: "Ayushman Bharat — PM-JAY", description: "Check eligibility and find empanelled hospitals under India's health cover scheme.", url: "https://pmjay.gov.in", category: "Health", ministry: "Ministry of Health & Family Welfare", state: null, level: "Central", languages: "English,Hindi", tags: "health insurance,hospitals", featured: 0, verified_date: "2026-06-05" },
      { id: "udyam", name: "Udyam Registration", description: "Register your business as a Micro, Small or Medium Enterprise.", url: "https://udyamregistration.gov.in", category: "Business & MSME", ministry: "Ministry of MSME", state: null, level: "Central", languages: "English,Hindi", tags: "msme,business registration", featured: 0, verified_date: "2026-07-02" },
      { id: "indiaportal", name: "India.gov.in", description: "The national portal — a directory of schemes, services and ministries.", url: "https://www.india.gov.in", category: "Utilities", ministry: "Ministry of Electronics & IT", state: null, level: "Central", languages: "English,Hindi", tags: "national portal", featured: 0, verified_date: "2026-04-08" },
      { id: "pan-protean", name: "Protean eGov — PAN Services", description: "Apply for a new PAN card, correction, or reprint through the authorised registrar.", url: "https://www.protean-tinpan.com", category: "PAN Card", ministry: "Ministry of Finance", state: null, level: "Central", languages: "English", tags: "pan,tax id", featured: 0, verified_date: "2026-05-30" },
      { id: "ncw", name: "National Commission for Women", description: "File a complaint or seek help regarding women's safety and rights.", url: "https://ncwapps.nic.in", category: "Women & Child", ministry: "Ministry of Women & Child Development", state: null, level: "Central", languages: "English,Hindi", tags: "women safety,complaint", featured: 0, verified_date: "2026-04-22" },
      { id: "cybercrime", name: "National Cyber Crime Reporting Portal", description: "Report cyber crime, financial fraud, and online harassment.", url: "https://cybercrime.gov.in", category: "Police", ministry: "Ministry of Home Affairs", state: null, level: "Central", languages: "English,Hindi", tags: "fraud,cyber crime,police", featured: 1, verified_date: "2026-07-06" },
      { id: "nps-cra", name: "National Pension System — CRA", description: "Manage your NPS account, view statements and make contributions.", url: "https://www.cra-nsdl.com", category: "Pension", ministry: "Pension Fund Regulatory & Development Authority", state: null, level: "Central", languages: "English", tags: "nps,retirement", featured: 0, verified_date: "2026-05-15" },
    ];
    db.exec("BEGIN");
    try {
      for (const s of sites) insertSite.run(s);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
}

migrate();
seed();

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
  featured: number;
  verified_date: string;
  created_at: string;
  updated_at: string;
};
