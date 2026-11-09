import { randomBytes } from "node:crypto";
import { all, get, run } from "./db";
import { dhakaDate } from "@/lib/booking";
import { NOTICE_CATEGORIES } from "@/lib/notice-format";

// Everything the website needs to read or change notices goes through these
// functions. Pages never write SQL for notices themselves.

export { NOTICE_CATEGORIES };
export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number];

export type Notice = {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  pinned: boolean;
  published: boolean;
  publish_at: string; // YYYY-MM-DD (Dhaka date)
  expires_at: string | null; // last day shown, YYYY-MM-DD
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type NoticeInput = Pick<Notice, "title" | "body" | "category" | "pinned" | "published" | "publish_at" | "expires_at" | "attachment_url" | "attachment_name" | "attachment_type">;

export type NoticeStatus = "published" | "draft" | "scheduled" | "expired";

type Row = Omit<Notice, "pinned" | "published"> & { pinned: number; published: number };
const toNotice = (row: Row): Notice => ({ ...row, pinned: Number(row.pinned) === 1, published: Number(row.published) === 1 });

const visible = "published = 1 AND publish_at <= ? AND (expires_at IS NULL OR expires_at >= ?)";
const order = "ORDER BY pinned DESC, publish_at DESC, created_at DESC";

/** Notices the public can see today: published, started, and not expired. */
export async function listPublicNotices(options: { limit?: number; category?: string } = {}) {
  const today = dhakaDate();
  const args: (string | number)[] = [today, today];
  let sql = `SELECT * FROM notices WHERE ${visible}`;
  if (options.category) { sql += " AND category = ?"; args.push(options.category); }
  sql += ` ${order}`;
  if (options.limit) { sql += " LIMIT ?"; args.push(options.limit); }
  return (await all<Row>(sql, args)).map(toNotice);
}

/** One page of the public notice board, optionally filtered by category and search words. */
export async function searchPublicNotices(options: { category?: string; query?: string; page?: number; pageSize: number }) {
  const today = dhakaDate();
  const where = [visible];
  const args: (string | number)[] = [today, today];
  if (options.category) { where.push("category = ?"); args.push(options.category); }
  const words = (options.query || "").trim().split(/\s+/).filter(Boolean).slice(0, 6);
  for (const word of words) {
    const pattern = `%${word.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    where.push("(title LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\')");
    args.push(pattern, pattern);
  }
  const condition = where.join(" AND ");
  const total = Number((await get<{ n: number }>(`SELECT COUNT(*) AS n FROM notices WHERE ${condition}`, args))?.n ?? 0);
  const pages = Math.max(1, Math.ceil(total / options.pageSize));
  const page = Math.min(Math.max(1, Math.floor(options.page || 1)), pages);
  const rows = await all<Row>(`SELECT * FROM notices WHERE ${condition} ${order} LIMIT ? OFFSET ?`, [...args, options.pageSize, (page - 1) * options.pageSize]);
  return { notices: rows.map(toNotice), total, page, pages };
}

export async function getPublicNotice(id: string) {
  const today = dhakaDate();
  const row = await get<Row>(`SELECT * FROM notices WHERE id = ? AND ${visible}`, [id, today, today]);
  return row ? toNotice(row) : undefined;
}

/** Every notice, for the admin list. */
export async function listAllNotices() {
  return (await all<Row>(`SELECT * FROM notices ORDER BY created_at DESC`)).map(toNotice);
}

export async function getNotice(id: string) {
  const row = await get<Row>("SELECT * FROM notices WHERE id = ?", [id]);
  return row ? toNotice(row) : undefined;
}

export async function createNotice(input: NoticeInput, userId: string | null) {
  const id = randomBytes(6).toString("base64url");
  const now = new Date().toISOString();
  await run(
    `INSERT INTO notices (id, title, body, category, pinned, published, publish_at, expires_at, attachment_url, attachment_name, attachment_type, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, input.title, input.body, input.category, input.pinned ? 1 : 0, input.published ? 1 : 0, input.publish_at, input.expires_at, input.attachment_url, input.attachment_name, input.attachment_type, userId, now, now],
  );
  return id;
}

export async function updateNotice(id: string, input: NoticeInput) {
  const result = await run(
    `UPDATE notices SET title = ?, body = ?, category = ?, pinned = ?, published = ?, publish_at = ?, expires_at = ?,
       attachment_url = ?, attachment_name = ?, attachment_type = ?, updated_at = ? WHERE id = ?`,
    [input.title, input.body, input.category, input.pinned ? 1 : 0, input.published ? 1 : 0, input.publish_at, input.expires_at, input.attachment_url, input.attachment_name, input.attachment_type, new Date().toISOString(), id],
  );
  return result.changes > 0;
}

export async function deleteNotice(id: string) {
  return (await run("DELETE FROM notices WHERE id = ?", [id])).changes > 0;
}

export function noticeStatus(notice: Notice, today = dhakaDate()): NoticeStatus {
  if (!notice.published) return "draft";
  if (notice.publish_at > today) return "scheduled";
  if (notice.expires_at && notice.expires_at < today) return "expired";
  return "published";
}

/** For public pages: an empty list instead of a crash if the database is unreachable. */
export async function safely<T>(load: () => Promise<T>, fallback: T): Promise<{ data: T; failed: boolean }> {
  try {
    return { data: await load(), failed: false };
  } catch (error) {
    console.error("Notice board could not load", error);
    return { data: fallback, failed: true };
  }
}
