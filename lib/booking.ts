export const slots = ["09:00–11:00", "11:00–13:00", "14:00–16:00"];
export function dhakaDate() { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()); }
export function validDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return false;
  const max = new Date(); max.setUTCDate(max.getUTCDate() + 90);
  return date > dhakaDate() && date <= max.toISOString().slice(0, 10) && ![5, 6].includes(parsed.getUTCDay());
}
export function dateSlots(date: string) { return validDate(date) ? slots.slice(0, new Date(`${date}T00:00:00Z`).getUTCDay() === 4 ? 2 : 3) : []; }
export const courses = ["New member orientation", "Basic Safety & FDM Operation", "Laser Safety Level 1", "CNC Machining Level 2 Certification", "Resin Handling & Post-Processing", "Cobot Safety & Programming", "Basic Electronics Safety"];
export const subjects = ["Training registration", "Visit request", "Fabrication request", "Design consultation request", "Industry collaboration enquiry", "Research collaboration proposal", "Project brief"];
