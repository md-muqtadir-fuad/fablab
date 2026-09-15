import { currentUser } from "@/lib/server/auth";
import { db, type Booking } from "@/lib/server/db";
import { checkOrigin, failure, HttpError } from "@/lib/server/http";
export async function DELETE(request: Request, {params}: {params: Promise<{id:string}>}) {
  try {
    checkOrigin(request); const user = await currentUser(); if (!user) throw new HttpError(401, "Please sign in.");
    const {id} = await params;
    const booking = db().prepare("SELECT * FROM bookings WHERE id=? AND user_id=?").get(id, user.id) as Booking | undefined;
    if (!booking) throw new HttpError(404, "Booking not found.");
    if (!["pending", "approved"].includes(booking.status)) throw new HttpError(409, "This booking is already closed.");
    const start = new Date(`${booking.date}T${booking.slot.slice(0,5)}:00+06:00`).getTime();
    if (start - Date.now() < 86400000) throw new HttpError(409, "For cancellations within 24 hours, contact the lab through the consultation form.");
    db().prepare("UPDATE bookings SET status='cancelled' WHERE id=? AND user_id=?").run(id, user.id);
    return Response.json({ok:true});
  } catch(error) { return failure(error); }
}
