import { currentUser, isAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
export async function GET(_request: Request, {params}: {params:Promise<{id:string}>}) {
  const user = await currentUser(); if (!user) return new Response("Unauthorized", {status:401});
  const {id} = await params;
  const file = db().prepare("SELECT * FROM uploads WHERE id=?").get(id) as {user_id:string; name:string; content:Buffer} | undefined;
  if (!file || (file.user_id !== user.id && !isAdmin(user))) return new Response("Not found", {status:404});
  return new Response(new Uint8Array(file.content), {headers:{"Content-Type":"application/octet-stream", "Content-Disposition":`attachment; filename="${file.name}"`, "Cache-Control":"private, no-store", "X-Content-Type-Options":"nosniff"}});
}
