import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { get, run, type User } from "./db";
const scrypt = promisify(scryptCallback);
export const cookieName = "fablab_session";
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${(await scrypt(password, salt, 64) as Buffer).toString("hex")}`; }
export async function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(":"); return timingSafeEqual(Buffer.from(hash, "hex"), await scrypt(password, salt, 64) as Buffer); }

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  return await get<User>("SELECT u.id, u.name, u.email, u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?", [digest(token), Date.now()]) || null;
}

/** Emails listed in ADMIN_EMAILS are always admins (kept for older setups). */
function listedAdmin(email: string) { return (process.env.ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean).includes(email); }
export function isListedStaffEmail(email: string) { return listedAdmin(email); }

/** Admins review bookings and requests, and manage all content. */
export function isAdmin(user: User | null) { return !!user && (user.role === "admin" || listedAdmin(user.email)); }
/** Editors manage website content (notices, and later events and gallery). */
export function canEditContent(user: User | null) { return isAdmin(user) || user?.role === "editor"; }

/** For admin pages: sends visitors to sign in, hides the page from non-staff. */
export async function requireContentEditor(next = "/admin") {
  const user = await currentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (!canEditContent(user)) notFound();
  return user;
}

export async function createSession(id: string) {
  const token = randomBytes(32).toString("hex");
  await run("DELETE FROM sessions WHERE expires < ?", [Date.now()]);
  await run("INSERT INTO sessions (token, user_id, expires) VALUES (?, ?, ?)", [digest(token), id, Date.now() + 7 * 86400000]);
  (await cookies()).set(cookieName, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && process.env.COOKIE_SECURE !== "false", path: "/", maxAge: 7 * 86400 });
}
