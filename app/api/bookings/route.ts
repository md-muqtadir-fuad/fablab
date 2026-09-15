import { randomUUID } from "node:crypto";
import { db } from "@/lib/server/db";
import { currentUser } from "@/lib/server/auth";
import { body, checkOrigin, failure, field, HttpError, rateLimit } from "@/lib/server/http";
import { dateSlots } from "@/lib/booking";
import { mockEquipment } from "@/data/fixtures/equipment";
export async function GET(request: Request) {
  const url = new URL(request.url), date = url.searchParams.get("date") || "", id = url.searchParams.get("equipment") || "";
  const equipment = mockEquipment.find(e => e.id === id);
  if (!equipment) return Response.json({ error: "Equipment not found." }, { status: 404 });
  const occupied = db().prepare("SELECT slot FROM bookings WHERE equipment_id=? AND date=? AND status IN ('pending','approved')").all(id, date) as {slot:string}[];
  return Response.json({ slots: ["maintenance", "unavailable"].includes(equipment.status) ? [] : dateSlots(date).filter(s => !occupied.some(o => o.slot === s)) }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  try {
    checkOrigin(request); const user = await currentUser(); if (!user) throw new HttpError(401, "Please sign in before booking."); rateLimit(`booking:${user.id}`);
    const data = await body(request), equipmentId = field(data, "equipmentId"), date = field(data, "date"), slot = field(data, "slot"), project = field(data, "project", 3), organisation = field(data, "organisation", 2), material = field(data, "material"), training = field(data, "training", 3, 500);
    const equipment = mockEquipment.find(e => e.id === equipmentId);
    if (!equipment) throw new HttpError(404, "Equipment not found.");
    if (["maintenance", "unavailable"].includes(equipment.status)) throw new HttpError(409, "This machine is unavailable for reservations.");
    if (!dateSlots(date).includes(slot)) throw new HttpError(400, "Choose an open date and time within the next 90 days. Bookings start from tomorrow.");
    if (!equipment.supportedMaterials.includes(material) || data.agreement !== true) throw new HttpError(400, "Select an approved material and accept the safety agreement.");
    const id = `FAB-${randomUUID()}`, estimate = equipment.externalRate * 2;
    const save = db().transaction(() => {
      db().prepare("INSERT INTO bookings (id,user_id,equipment_id,date,slot,project,organisation,material,training,estimate,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)").run(id, user.id, equipmentId, date, slot, project, organisation, material, training, estimate, new Date().toISOString());
      if (data.uploadId) { const result = db().prepare("UPDATE uploads SET booking_id=? WHERE id=? AND user_id=? AND booking_id IS NULL").run(id, String(data.uploadId), user.id); if (!result.changes) throw new HttpError(400, "The attachment is unavailable. Upload it again."); }
    });
    try { save(); } catch (error) { if ((error as {code?:string}).code?.includes("CONSTRAINT_UNIQUE")) throw new HttpError(409, "Someone just reserved that slot. Choose another time."); throw error; }
    return Response.json({ id, estimate, status: "pending" }, { status: 201 });
  } catch (error) { return failure(error); }
}
