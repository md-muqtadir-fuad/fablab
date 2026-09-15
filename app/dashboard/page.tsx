import { redirect } from "next/navigation";
import Link from "next/link";
import { currentUser,isAdmin } from "@/lib/server/auth";
import { db,type Booking,type Enquiry } from "@/lib/server/db";
import { Records } from "@/components/content/Records";
import { SignOut } from "@/components/forms/RecordActions";
export const metadata={title:"Member dashboard",robots:{index:false,follow:false}};
export default async function Dashboard() {
  const user=await currentUser();if(!user)redirect("/login?next=/dashboard");
  const bookings=db().prepare("SELECT b.*,u.id AS upload_id,u.name AS upload_name FROM bookings b LEFT JOIN uploads u ON u.booking_id=b.id WHERE b.user_id=? ORDER BY b.created_at DESC").all(user.id) as Booking[];
  const requests=db().prepare("SELECT * FROM requests WHERE user_id=? ORDER BY created_at DESC").all(user.id) as Enquiry[];
  return <div className="mx-auto w-full max-w-5xl px-4 py-12"><div className="flex flex-wrap justify-between gap-5"><div><h1 className="text-3xl font-bold text-buet-red-dark">Welcome, {user.name}</h1><p className="mt-3 text-neutral-600">Track bookings, download files, and review request status.</p></div><SignOut/></div>{isAdmin(user) && <Link href="/admin" className="mt-5 inline-block font-semibold text-buet-red underline">Open staff review</Link>}<Records bookings={bookings} requests={requests}/></div>;
}
