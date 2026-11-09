import { createClient, type Client, type InStatement, type InValue } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { databaseConfig, migrate } from "./migrations.mjs";

// One shared connection per server process.
// Locally this is a SQLite file (.data/fablab.sqlite). Set DATABASE_URL (and
// DATABASE_AUTH_TOKEN) to use a Turso/libSQL database instead, with no code changes.
let client: Client | undefined;
let ready: Promise<Client> | undefined;

async function connect() {
  const config = databaseConfig();
  if (config.file) mkdirSync(path.dirname(path.resolve(config.file)), { recursive: true });
  const connection = createClient({ url: config.url, authToken: config.authToken });
  if (config.local) {
    await connection.execute("PRAGMA journal_mode = WAL");
    await connection.execute("PRAGMA busy_timeout = 5000");
    await connection.execute("PRAGMA foreign_keys = ON");
  }
  // Remote Turso databases manage these settings themselves.
  await migrate(connection);
  client = connection;
  return connection;
}

/** The ready-to-use database client. Runs pending migrations on first use. */
export function db(): Promise<Client> {
  if (client) return Promise.resolve(client);
  ready ??= connect().catch((error) => { ready = undefined; throw error; });
  return ready;
}

type Args = InValue[];

/** All matching rows. */
export async function all<T>(sql: string, args: Args = []): Promise<T[]> {
  const result = await (await db()).execute({ sql, args });
  return result.rows as unknown as T[];
}

/** The first matching row, or undefined. */
export async function get<T>(sql: string, args: Args = []): Promise<T | undefined> {
  return (await all<T>(sql, args))[0];
}

/** Runs a write and returns how many rows changed. */
export async function run(sql: string, args: Args = []): Promise<{ changes: number }> {
  const result = await (await db()).execute({ sql, args });
  return { changes: result.rowsAffected };
}

/** Runs several writes together: all succeed or none do. */
export async function batch(statements: InStatement[]) {
  return (await db()).batch(statements, "write");
}

/** True when a write failed because of a UNIQUE or other constraint. */
export function isConstraintError(error: unknown) {
  const { code, extendedCode, message } = error as { code?: string; extendedCode?: string; message?: string };
  return [code, extendedCode, message].some((value) => typeof value === "string" && value.includes("CONSTRAINT"));
}

export type Role = "member" | "editor" | "admin";
export type User = { id: string; name: string; email: string; role: Role };
export type Booking = { id: string; user_id: string; equipment_id: string; date: string; slot: string; project: string; organisation: string; material: string; training: string; estimate: number; status: string; created_at: string; name?: string; email?: string; upload_id?: string; upload_name?: string };
export type Enquiry = { id: string; subject: string; name: string; email: string; organisation: string; details: string; extra: string; status: string; created_at: string };
