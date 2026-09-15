import { randomUUID } from "node:crypto";
import { currentUser } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { checkOrigin, failure, HttpError, rateLimit, readLimited } from "@/lib/server/http";
export async function POST(request: Request) {
  try {
    checkOrigin(request); const user = await currentUser(); if (!user) throw new HttpError(401, "Please sign in."); rateLimit(`upload:${user.id}`, 10);
    if (Number(request.headers.get("content-length") || 0) > 11 * 1024 * 1024) throw new HttpError(413, "Maximum file size is 10 MB.");
    const bytes = await readLimited(request, 11 * 1024 * 1024);
    let form: FormData;
    try {form = await new Response(new Uint8Array(bytes), {headers:{"Content-Type":request.headers.get("content-type") || ""}}).formData();} catch {throw new HttpError(400,"Invalid file upload.");}
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 10 * 1024 * 1024 || !/\.(stl|step|stp|dxf|pdf)$/i.test(file.name)) throw new HttpError(400, "Upload an STL, STEP, DXF or PDF file of up to 10 MB.");
    const id = randomUUID();
    db().prepare("DELETE FROM uploads WHERE booking_id IS NULL AND created_at < ?").run(new Date(Date.now() - 86400000).toISOString());
    db().prepare("INSERT INTO uploads VALUES (?,?,NULL,?,?,?)").run(id, user.id, file.name.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(-120), Buffer.from(await file.arrayBuffer()), new Date().toISOString());
    return Response.json({id}, {status:201});
  } catch(error) { return failure(error); }
}
