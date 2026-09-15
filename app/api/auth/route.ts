import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { db, type User } from "@/lib/server/db";
import { cookieName, createSession, currentUser, digest, hashPassword, isAdmin, verifyPassword } from "@/lib/server/auth";
import { body, checkOrigin, emailField, failure, field, HttpError, rateLimit } from "@/lib/server/http";
export const runtime = "nodejs";
export async function GET() { const user = await currentUser(); return Response.json({ user, admin: isAdmin(user) }, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  try {
    checkOrigin(request); rateLimit('auth:global', 300); const data = await body(request); const email = emailField(data); rateLimit(`auth:${email}`, 12);
    const password = data.password;
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new HttpError(400, 'Password must contain 12–128 characters.');
    if (data.mode === "register") {
      if ((process.env.ADMIN_EMAILS || "").split(",").some(x => x.trim().toLowerCase() === email)) throw new HttpError(403, "Staff accounts must be provisioned by the server administrator.");
      const name = field(data, "name", 2, 100);
      const id = randomUUID(); const hash = await hashPassword(password);
      try { db().prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?)").run(id, name, email, hash, new Date().toISOString()); } catch (error) { if ((error as {code?:string}).code?.includes("CONSTRAINT")) throw new HttpError(409, "An account already exists for this email. Sign in instead."); throw error; }
      await createSession(id);
    } else if (data.mode === "login") {
      const user = db().prepare("SELECT * FROM users WHERE email=?").get(email) as (User & {password: string}) | undefined;
      if (!user || !await verifyPassword(password, user.password)) throw new HttpError(401, "Email or password is incorrect.");
      await createSession(user.id);
    } else throw new HttpError(400, "Invalid sign-in action.");
    return Response.json({ ok: true });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) { try { checkOrigin(request); const jar = await cookies(); const token = jar.get(cookieName)?.value; if (token) db().prepare("DELETE FROM sessions WHERE token=?").run(digest(token)); jar.delete(cookieName); return Response.json({ ok: true }); } catch (error) { return failure(error); } }
