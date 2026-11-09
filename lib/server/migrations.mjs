// Database schema, applied in order. Shared by the website (lib/server/db.ts)
// and the setup script (scripts/db-setup.mjs).
//
// To change the schema: never edit a migration that has already run.
// Add a new entry with the next id at the end of the list instead.

export const migrations = [
  {
    id: 1,
    name: "initial tables",
    statements: [
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        expires INTEGER NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS requests (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        subject TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        organisation TEXT NOT NULL,
        details TEXT NOT NULL,
        extra TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        equipment_id TEXT NOT NULL,
        date TEXT NOT NULL,
        slot TEXT NOT NULL,
        project TEXT NOT NULL,
        organisation TEXT NOT NULL,
        material TEXT NOT NULL,
        training TEXT NOT NULL,
        estimate INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS active_booking_slot
        ON bookings(equipment_id, date, slot) WHERE status IN ('pending', 'approved')`,
      `CREATE TABLE IF NOT EXISTS uploads (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        booking_id TEXT REFERENCES bookings(id),
        name TEXT NOT NULL,
        content BLOB NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        expires INTEGER NOT NULL
      )`,
    ],
  },
  {
    id: 2,
    name: "staff roles and notice board",
    statements: [
      // member | editor | admin
      `ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'member'`,
      `CREATE TABLE IF NOT EXISTS notices (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        category TEXT NOT NULL,
        pinned INTEGER NOT NULL DEFAULT 0,
        published INTEGER NOT NULL DEFAULT 1,
        publish_at TEXT NOT NULL,
        expires_at TEXT,
        attachment_url TEXT,
        attachment_name TEXT,
        attachment_type TEXT,
        created_by TEXT REFERENCES users(id),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS notices_listing ON notices(published, publish_at)`,
    ],
  },
];

/**
 * Applies every migration that has not run yet.
 * @param {import("@libsql/client").Client} client
 */
export async function migrate(client) {
  await client.execute(
    "CREATE TABLE IF NOT EXISTS schema_migrations (id INTEGER PRIMARY KEY, name TEXT NOT NULL, applied_at TEXT NOT NULL)",
  );
  const done = new Set((await client.execute("SELECT id FROM schema_migrations")).rows.map((row) => Number(row.id)));
  for (const migration of migrations) {
    if (done.has(migration.id)) continue;
    await client.batch(
      [
        ...migration.statements,
        {
          sql: "INSERT OR IGNORE INTO schema_migrations (id, name, applied_at) VALUES (?, ?, ?)",
          args: [migration.id, migration.name, new Date().toISOString()],
        },
      ],
      "write",
    );
  }
}

/** Database location: Turso/libSQL URL when set, otherwise a local SQLite file. */
export function databaseConfig(env = process.env) {
  if (env.DATABASE_URL) return { url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN || undefined, local: env.DATABASE_URL.startsWith("file:") };
  const file = (env.DATABASE_PATH || ".data/fablab.sqlite").replace(/\\/g, "/");
  return { url: `file:${file}`, authToken: undefined, local: true, file };
}
