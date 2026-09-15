import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import path from "node:path";

let connection: Database.Database | undefined;
export function db() {
  if (connection) return connection;
  const file = process.env.DATABASE_PATH || path.join(process.cwd(), ".data", "fablab.sqlite");
  mkdirSync(path.dirname(file), { recursive: true });
  connection = new Database(file);
  connection.pragma("journal_mode = WAL");
  connection.pragma("foreign_keys = ON");
  connection.pragma("busy_timeout = 5000");
  connection.exec(`
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS requests (id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), subject TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, organisation TEXT NOT NULL, details TEXT NOT NULL, extra TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), equipment_id TEXT NOT NULL, date TEXT NOT NULL, slot TEXT NOT NULL, project TEXT NOT NULL, organisation TEXT NOT NULL, material TEXT NOT NULL, training TEXT NOT NULL, estimate INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL);
    CREATE UNIQUE INDEX IF NOT EXISTS active_booking_slot ON bookings(equipment_id, date, slot) WHERE status IN ('pending', 'approved');
    CREATE TABLE IF NOT EXISTS uploads (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), booking_id TEXT REFERENCES bookings(id), name TEXT NOT NULL, content BLOB NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
  `);
  return connection;
}
export type User = { id: string; name: string; email: string };
export type Booking = { id: string; user_id: string; equipment_id: string; date: string; slot: string; project: string; organisation: string; material: string; training: string; estimate: number; status: string; created_at: string; name?: string; email?: string; upload_id?: string; upload_name?: string };
export type Enquiry = { id: string; subject: string; name: string; email: string; organisation: string; details: string; extra: string; status: string; created_at: string };
