import { currentUser, isAdmin } from "@/lib/server/auth";
import { get, run, type Booking } from "@/lib/server/db";
import { body, checkOrigin, failure, field, HttpError } from "@/lib/server/http";
export async function PATCH(request: Request) {
  try {
    checkOrigin(request); if (!isAdmin(await currentUser())) throw new HttpError(403, "Staff access required.");
    const data = await body(request), id = field(data,"id"), status = field(data,"status");
    if (!["approved","rejected","completed"].includes(status) || !["bookings","requests"].includes(String(data.kind))) throw new HttpError(400,"Invalid status change.");
    const table = data.kind === "bookings" ? "bookings" : "requests";
    const row = await get<Booking>(`SELECT * FROM ${table} WHERE id=?`, [id]);
    if (!row) throw new HttpError(404,"Record not found.");
    if ((status === "completed" && row.status !== "approved") || (status !== "completed" && row.status !== "pending")) throw new HttpError(409,"The request status changed. Refresh and try again.");
    if (table === "bookings" && status === "approved" && new Date(`${row.date}T${row.slot.slice(0,5)}:00+06:00`).getTime() < Date.now()) throw new HttpError(409,"This session has already passed. Reject the request and ask the member to rebook.");
    const updated = await run(`UPDATE ${table} SET status=? WHERE id=? AND status=?`, [status,id,row.status]);
    if (!updated.changes) throw new HttpError(409,"The request changed. Refresh and try again.");
    return Response.json({ok:true});
  } catch(error) { return failure(error); }
}
