import { notFound } from "next/navigation";
import Link from "next/link";
import { mockEquipment } from "@/data/fixtures/equipment";
import { currentUser } from "@/lib/server/auth";
import { BookingForm } from "@/components/forms/BookingForm";
import { Button } from "@/components/ui/button";
export function generateStaticParams() { return mockEquipment.map(({id}) => ({id})); }
export const dynamicParams = false;
export default async function BookingPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params,equipment=mockEquipment.find(e=>e.id===id);if(!equipment) notFound();
  const user=await currentUser();
  return <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6"><Link href={`/equipment/${id}`} className="text-sm text-buet-red hover:underline">← Equipment details</Link><h1 className="my-6 text-3xl font-bold text-buet-red-dark">Book {equipment.name}</h1>
    {["maintenance","unavailable"].includes(equipment.status) ? <div className="surface space-y-4"><h2 className="text-xl font-bold">Machine currently unavailable</h2><p>This machine cannot accept reservations until staff restore availability.</p><Button asChild><Link href="/equipment">Find another machine</Link></Button></div> : user ? <BookingForm equipment={equipment}/> : <div className="surface space-y-5"><h2 className="text-xl font-bold">Sign in to request a session</h2><p>Your account keeps reservations and project files together.</p><Button asChild><Link href={`/login?next=/equipment/${id}/book`}>Sign in or create an account</Link></Button></div>}
  </div>;
}
