import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Ruler, ShieldCheck } from "lucide-react";
import { mockEquipment } from "@/data/fixtures/equipment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return mockEquipment.map(({ id }) => ({ id }));
}

export default async function EquipmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipment = mockEquipment.find((item) => item.id === id);
  if (!equipment) notFound();

  return (
    <div className="bg-neutral-50 py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/equipment" className="text-sm font-medium text-buet-red hover:underline">← Equipment catalogue</Link>
        <div className="mt-6 grid overflow-hidden border border-neutral-300 border-t-4 border-t-buet-red bg-white lg:grid-cols-2">
          <div className="relative min-h-80 bg-neutral-200">
            <Image src={equipment.image} alt={equipment.name} fill className="object-cover" />
          </div>
          <div className="p-7 lg:p-10">
            <Badge className="capitalize">{equipment.status.replace("-", " ")}</Badge>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-neutral-500">{equipment.category}</p>
            <h1 className="mt-2 text-4xl font-bold text-buet-red-dark">{equipment.name}</h1>
            <p className="mt-5 leading-7 text-neutral-600">{equipment.shortDescription}</p>
            <dl className="mt-8 space-y-4 border-y py-6 text-sm">
              <div className="flex gap-3"><MapPin className="h-5 w-5 text-buet-red" /><div><dt className="font-semibold">Location</dt><dd className="text-neutral-600">{equipment.facility}, {equipment.room}</dd></div></div>
              <div className="flex gap-3"><Ruler className="h-5 w-5 text-buet-red" /><div><dt className="font-semibold">Working area</dt><dd className="text-neutral-600">{equipment.workingArea}</dd></div></div>
              <div className="flex gap-3"><ShieldCheck className="h-5 w-5 text-buet-red" /><div><dt className="font-semibold">Required training</dt><dd className="text-neutral-600">{equipment.trainingRequired}</dd></div></div>
            </dl>
            <h2 className="mt-7 font-semibold">Supported materials</h2>
            <div className="mt-3 flex flex-wrap gap-2">{equipment.supportedMaterials.map((material) => <Badge key={material} variant="secondary">{material}</Badge>)}</div>
            <Button size="lg" className="mt-8 w-full" asChild><Link href={`/equipment/${equipment.id}/book`}>Book this machine</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
