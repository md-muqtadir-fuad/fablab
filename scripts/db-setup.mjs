// npm run db:setup
//
// 1. Creates or updates the database tables (safe to run again at any time).
// 2. Creates the first admin account (asks for email and password, or reads
//    ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME). An existing account is made admin;
//    its password is never changed.
// 3. Adds a few sample notices if there are none yet. Skip with: npm run db:setup -- --no-seed
//
// Reads .env.local, so it uses the same database as the website
// (local SQLite file by default, or Turso when DATABASE_URL is set).

import { createClient } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import readline from "node:readline";
import { databaseConfig, migrate } from "../lib/server/migrations.mjs";

const flags = new Set(process.argv.slice(2));
try { process.loadEnvFile(".env.local"); } catch { /* no .env.local: use defaults */ }

const config = databaseConfig();
if (config.file) mkdirSync(path.dirname(path.resolve(config.file)), { recursive: true });
const db = createClient({ url: config.url, authToken: config.authToken });

function ask(question, hidden = false) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (hidden) rl._writeToOutput = (text) => { if (text.includes(question)) process.stdout.write(question); };
  return new Promise((resolve) => rl.question(question, (answer) => { rl.close(); if (hidden) process.stdout.write("\n"); resolve(answer.trim()); }));
}

const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const shift = (days) => { const date = new Date(`${today}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + days); return date.toISOString().slice(0, 10); };

async function setupAdmin() {
  let email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD || "";
  let name = process.env.ADMIN_NAME || "";
  if (!email && !process.stdin.isTTY) { console.log("• Admin account: skipped (set ADMIN_EMAIL and ADMIN_PASSWORD to create one)."); return null; }
  if (!email) {
    console.log("\nCreate the first admin account (press Enter on the email to skip).");
    email = (await ask("  Admin email: ")).toLowerCase();
    if (!email) { console.log("• Admin account: skipped."); return null; }
  }
  if (!validEmail(email)) throw new Error("That email address is not valid.");

  const existing = (await db.execute({ sql: "SELECT id, role FROM users WHERE email = ?", args: [email] })).rows[0];
  if (existing) {
    if (existing.role !== "admin") await db.execute({ sql: "UPDATE users SET role = 'admin' WHERE id = ?", args: [existing.id] });
    console.log(`• Admin account: ${email} already exists and is an admin. Password unchanged.`);
    return String(existing.id);
  }
  if (!name && process.stdin.isTTY && !process.env.ADMIN_EMAIL) name = await ask("  Your name: ");
  if (!password) password = await ask("  Password (12+ characters, hidden): ", true);
  if (password.length < 12 || password.length > 128) throw new Error("The password must be 12–128 characters.");

  const id = randomUUID();
  const salt = randomBytes(16).toString("hex");
  const hash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  await db.execute({
    sql: "INSERT INTO users (id, name, email, password, created_at, role) VALUES (?, ?, ?, ?, ?, 'admin')",
    args: [id, name || "FabLab Staff", email, hash, new Date().toISOString()],
  });
  console.log(`• Admin account: created for ${email}.`);
  return id;
}

async function seedNotices(adminId) {
  if (flags.has("--no-seed")) { console.log("• Sample notices: skipped (--no-seed)."); return; }
  const count = Number((await db.execute("SELECT COUNT(*) AS n FROM notices")).rows[0].n);
  if (count > 0) { console.log(`• Sample notices: skipped (${count} notices already exist).`); return; }
  const sample = "\n\n(Sample notice for testing. Delete it before launch.)";
  const notices = [
    { title: "Laser cutter bay closed for maintenance", category: "Urgent", pinned: 1, publish_at: today, expires_at: shift(10), body: `The Epilog Fusion Pro laser cutter is closed for scheduled maintenance. Existing bookings for this machine will be moved by the lab team, who will contact you directly.\n\nOther machines remain available as normal.${sample}` },
    { title: "Orientation for new members — registration open", category: "Training", pinned: 0, publish_at: shift(-2), expires_at: shift(30), body: `A lab orientation and general safety session is held every Sunday at 10:00. It is required before booking any machine.\n\nRegister through the training page and bring your student or staff ID card.${sample}` },
    { title: "Open House: student project showcase", category: "Event", pinned: 0, publish_at: shift(-5), expires_at: null, body: `Teams who built their projects at the lab will present prototypes, posters and live demonstrations. All students and faculty are welcome.\n\nVenue: Advanced Fabrication Lab, IAT, BUET.${sample}` },
    { title: "ল্যাব পরিদর্শনের নতুন সময়সূচি", category: "General", pinned: 0, publish_at: shift(-8), expires_at: null, body: `এখন থেকে দলগত ল্যাব পরিদর্শন রবিবার থেকে বৃহস্পতিবার সকাল ১০টা থেকে দুপুর ১২টা পর্যন্ত হবে। পরিদর্শনের অন্তত তিন দিন আগে ওয়েবসাইটের মাধ্যমে আবেদন করুন।${sample}` },
  ];
  const now = new Date().toISOString();
  await db.batch(notices.map((notice) => ({
    sql: `INSERT INTO notices (id, title, body, category, pinned, published, publish_at, expires_at, created_by, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?)`,
    args: [randomBytes(6).toString("base64url"), notice.title, notice.body, notice.category, notice.pinned, notice.publish_at, notice.expires_at, adminId, now, now],
  })), "write");
  console.log(`• Sample notices: added ${notices.length}. Delete them from /admin/notices before launch.`);
}

try {
  console.log(`Database: ${config.local ? config.url.replace(/^file:/, "") + " (local file)" : config.url}`);
  await migrate(db);
  console.log("• Tables: up to date.");
  const adminId = await setupAdmin();
  await seedNotices(adminId);
  console.log("\nDone. Start the site with: npm run dev");
  if (process.env.ENABLE_ADMIN !== "true") console.log("Note: set ENABLE_ADMIN=true in .env.local to switch on the notice board.");
} catch (error) {
  console.error(`\nSetup failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  db.close();
}
