import { redirect } from "next/navigation";
import Link from "next/link";
import { canEditContent, currentUser, isAdmin } from "@/lib/server/auth";
import { all, type Booking, type Enquiry } from "@/lib/server/db";
import { contentEnabled } from "@/lib/features";
import { Records } from "@/components/content/Records";
import { SignOut } from "@/components/forms/RecordActions";
export const metadata={title:"Member dashboard",robots:{index:false,follow:false}};
export default async function Dashboard() {
  const user=await currentUser();if(!user)redirect("/login?next=/dashboard");
  const bookings=await all<Booking>("SELECT b.*,u.id AS upload_id,u.name AS upload_name FROM bookings b LEFT JOIN uploads u ON u.booking_id=b.id WHERE b.user_id=? ORDER BY b.created_at DESC",[user.id]);
  const requests=await all<Enquiry>("SELECT * FROM requests WHERE user_id=? ORDER BY created_at DESC",[user.id]);
  const staffLink=isAdmin(user) ? "/admin" : contentEnabled() && canEditContent(user) ? "/admin/notices" : "";
  return <div className="mx-auto w-full max-w-5xl px-4 py-12"><div className="flex flex-wrap justify-between gap-5"><div><h1 className="text-3xl font-bold text-buet-red-dark">Welcome, {user.name}</h1><p className="mt-3 text-neutral-600">Track bookings, download files, and review request status.</p></div><SignOut/></div>{staffLink && <Link href={staffLink} className="mt-5 inline-block font-semibold text-buet-red underline">Open admin panel</Link>}<Records bookings={bookings} requests={requests}/></div>;
}
