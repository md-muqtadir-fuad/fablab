import { redirect,notFound } from "next/navigation";
import { currentUser,isAdmin } from "@/lib/server/auth";
import { db,type Booking,type Enquiry } from "@/lib/server/db";
import { Records } from "@/components/content/Records";
export const metadata={title:"Staff review",robots:{index:false,follow:false}};
export default async function Admin() {
  const user=await currentUser();if(!user)redirect("/login?next=/admin");if(!isAdmin(user))notFound();
  const bookings=db().prepare("SELECT b.*,p.name,p.email,u.id AS upload_id,u.name AS upload_name FROM bookings b JOIN users p ON p.id=b.user_id LEFT JOIN uploads u ON u.booking_id=b.id ORDER BY b.created_at DESC").all() as Booking[];
  const requests=db().prepare("SELECT * FROM requests ORDER BY created_at DESC").all() as Enquiry[];
  return <div className="mx-auto w-full max-w-5xl px-4 py-12"><h1 className="text-3xl font-bold text-buet-red-dark">Staff review</h1><p className="mt-4 text-neutral-600">Review applicant training, project details, and materials before approving. Status updates appear in member dashboards.</p><Records bookings={bookings} requests={requests} admin/></div>;
}
