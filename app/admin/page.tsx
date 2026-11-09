import { redirect, notFound } from "next/navigation";
import { currentUser, isAdmin } from "@/lib/server/auth";
import { all, type Booking, type Enquiry } from "@/lib/server/db";
import { contentEnabled } from "@/lib/features";
import { Records } from "@/components/content/Records";
export const metadata = { title: "Staff review" };
export default async function Admin() {
  const user = await currentUser();
  if (!user) redirect("/login?next=/admin");
  if (!isAdmin(user)) { if (contentEnabled()) redirect("/admin/notices"); notFound(); }
  const bookings = await all<Booking>("SELECT b.*,p.name,p.email,u.id AS upload_id,u.name AS upload_name FROM bookings b JOIN users p ON p.id=b.user_id LEFT JOIN uploads u ON u.booking_id=b.id ORDER BY b.created_at DESC");
  const requests = await all<Enquiry>("SELECT * FROM requests ORDER BY created_at DESC");
  return <div><h1 className="text-3xl font-bold text-buet-red-dark">Staff review</h1><p className="mt-4 text-neutral-600">Review applicant training, project details, and materials before approving. Status updates appear in member dashboards.</p><Records bookings={bookings} requests={requests} admin/></div>;
}
