import { db } from "./db";
export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(process.env.APP_URL || request.url).origin) throw new HttpError(403, "Request origin was not accepted. Refresh the page and try again.");
}
export function rateLimit(key: string, limit = 20) {
  const now = Date.now();
  db().prepare("DELETE FROM rate_limits WHERE expires < ?").run(now);
  const row = db().prepare("INSERT INTO rate_limits VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<? THEN excluded.expires ELSE expires END RETURNING count").get(key, now + 15 * 60000, now, now) as { count: number };
  if (row.count > limit) throw new HttpError(429, "Too many attempts. Please try again in 15 minutes.");
}
export async function body(request: Request) {
  const text = new TextDecoder().decode(await readLimited(request, 30000));
  try { const value = JSON.parse(text); if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(); return value as Record<string, unknown>; } catch { throw new HttpError(400, "Invalid request body."); }
}
export async function readLimited(request: Request, limit: number) {
  if (Number(request.headers.get("content-length") || 0) > limit) throw new HttpError(413, "Request is too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "A request body is required.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const {done,value} = await reader.read(); if (done) break; size += value.byteLength; if (size > limit) {await reader.cancel(); throw new HttpError(413,"Request is too large.");} chunks.push(value); }
  return Buffer.concat(chunks);
}
export function field(data: Record<string, unknown>, key: string, min = 1, max = 200) {
  const value = data[key];
  if (typeof value !== "string" || value.trim().length < min || value.trim().length > max) throw new HttpError(400, `Please provide a valid ${key} (${min}–${max} characters).`);
  return value.trim();
}
export function emailField(data: Record<string, unknown>) { const value = field(data, "email", 3, 254).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new HttpError(400, "Enter a valid email address."); return value; }
export function failure(error: unknown) { if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status }); console.error("Request failed", error); return Response.json({ error: "We could not save your changes. Please try again." }, { status: 500 }); }
