import { notFound } from "next/navigation";
import { mockEquipment } from "@/data/fixtures/equipment";

export default async function EquipmentLayout({ children, params }: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mockEquipment.some((item) => item.id === id)) notFound();
  return children;
}
