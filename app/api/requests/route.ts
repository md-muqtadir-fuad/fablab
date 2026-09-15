import { randomUUID } from "node:crypto";
import { db } from "@/lib/server/db";
import { currentUser } from "@/lib/server/auth";
import { body, checkOrigin, emailField, failure, field, HttpError, rateLimit } from "@/lib/server/http";
import { courses, subjects, validDate } from "@/lib/booking";
export async function POST(request: Request) {
  try {
    checkOrigin(request); rateLimit('requests:global', 300); const data = await body(request);
    const name = field(data, "name", 2, 100), email = emailField(data), subject = field(data, "subject"), organisation = field(data, "organisation", 2), details = field(data, "details", 20, 5000);
    rateLimit(`request:${email}`, 10);
    if (!subjects.includes(subject) || data.consent !== true) throw new HttpError(400, "Select a valid request and agree to be contacted.");
    const extra: Record<string, string> = {};
    if (subject === "Training registration") { extra.course = field(data, "course"); if (!courses.includes(extra.course)) throw new HttpError(400, "Choose a training course."); }
    if (subject === "Visit request") { extra.date = field(data, "date"); extra.visitors = field(data, "visitors"); if (!validDate(extra.date) || !/^\d+$/.test(extra.visitors) || Number(extra.visitors) < 1 || Number(extra.visitors) > 50) throw new HttpError(400, "Choose an open day within the next 90 days and a group of 1–50 visitors."); }
    const user = await currentUser(), id = `REQ-${randomUUID()}`;
    db().prepare("INSERT INTO requests (id,user_id,subject,name,email,organisation,details,extra,created_at) VALUES (?,?,?,?,?,?,?,?,?)").run(id, user?.id || null, subject, name, email, organisation, details, JSON.stringify(extra), new Date().toISOString());
    return Response.json({ id, status: "pending" }, { status: 201 });
  } catch (error) { return failure(error); }
}
