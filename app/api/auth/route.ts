import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { get, isConstraintError, run } from "@/lib/server/db";
import { cookieName, createSession, currentUser, digest, hashPassword, isAdmin, isListedStaffEmail, verifyPassword } from "@/lib/server/auth";
import { body, checkOrigin, emailField, failure, field, HttpError, rateLimit } from "@/lib/server/http";
export const runtime = "nodejs";
export async function GET() { const user = await currentUser(); return Response.json({ user, admin: isAdmin(user) }, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  try {
    checkOrigin(request); await rateLimit('auth:global', 300); const data = await body(request); const email = emailField(data); await rateLimit(`auth:${email}`, 12);
    const password = data.password;
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) throw new HttpError(400, 'Password must contain 12–128 characters.');
    if (data.mode === "register") {
      if (isListedStaffEmail(email)) throw new HttpError(403, "Staff accounts must be provisioned by the server administrator.");
      const name = field(data, "name", 2, 100);
      const id = randomUUID(); const hash = await hashPassword(password);
      try { await run("INSERT INTO users (id, name, email, password, created_at) VALUES (?, ?, ?, ?, ?)", [id, name, email, hash, new Date().toISOString()]); } catch (error) { if (isConstraintError(error)) throw new HttpError(409, "An account already exists for this email. Sign in instead."); throw error; }
      await createSession(id);
    } else if (data.mode === "login") {
      const user = await get<{ id: string; password: string }>("SELECT id, password FROM users WHERE email=?", [email]);
      if (!user || !await verifyPassword(password, user.password)) throw new HttpError(401, "Email or password is incorrect.");
      await createSession(user.id);
    } else throw new HttpError(400, "Invalid sign-in action.");
    return Response.json({ ok: true });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) { try { checkOrigin(request); const jar = await cookies(); const token = jar.get(cookieName)?.value; if (token) await run("DELETE FROM sessions WHERE token=?", [digest(token)]); jar.delete(cookieName); return Response.json({ ok: true }); } catch (error) { return failure(error); } }
