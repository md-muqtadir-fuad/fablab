import { cookies } from "next/headers";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { db, type User } from "./db";
const scrypt = promisify(scryptCallback);
export const cookieName = "fablab_session";
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${(await scrypt(password, salt, 64) as Buffer).toString("hex")}`; }
export async function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(":"); return timingSafeEqual(Buffer.from(hash, "hex"), await scrypt(password, salt, 64) as Buffer); }
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  return db().prepare("SELECT u.id, u.name, u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?").get(digest(token), Date.now()) as User || null;
}
export function isAdmin(user: User | null) { return !!user && (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).includes(user.email); }
export async function createSession(id: string) {
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now());
  db().prepare("INSERT INTO sessions VALUES (?, ?, ?)").run(digest(token), id, Date.now() + 7 * 86400000);
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false", path: "/", maxAge: 7 * 86400 });
}
