// Display helpers for notices, safe to use in both server and browser code.

/** Largest notice attachment. Kept under Vercel's 4.5 MB request limit. */
export const MAX_ATTACHMENT_MB = 4;

/** Notice categories. Add or rename here; the form, filters and colours follow. */
export const NOTICE_CATEGORIES = ["General", "Training", "Event", "Recruitment", "Closure", "Urgent"] as const;

/** Notices shown per page on the public notice board. */
export const NOTICES_PER_PAGE = 10;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-09" → "9 November 2026" */
export function formatDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return `${day} ${months[month - 1]} ${year}`;
}

/** "2026-11-09" → { day: "09", month: "Nov", year: "2026" } */
export function dateParts(value: string) {
  const [year, month, day] = value.split("-");
  return { day, month: months[Number(month) - 1]?.slice(0, 3) || "", year };
}

/** First part of the notice text, cut at a word boundary. */
export function excerpt(text: string, length = 180) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  const cut = clean.slice(0, length);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), length - 30))}…`;
}

export const categoryStyles: Record<string, string> = {
  General: "bg-neutral-100 text-neutral-700",
  Training: "bg-blue-50 text-blue-800",
  Event: "bg-amber-50 text-amber-800",
  Recruitment: "bg-emerald-50 text-emerald-800",
  Closure: "bg-neutral-800 text-white",
  Urgent: "bg-buet-red text-white",
};
