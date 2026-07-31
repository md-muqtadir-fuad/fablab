import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export function RequestPage({ title, intro, subject, submitLabel }: { title: string; intro: string; subject: string; submitLabel?: string }) {
  return (
    <div className="bg-[#faf8f4] py-14 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-buet-red hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to FabLab
        </Link>
        <h1 className="mt-7 text-4xl font-bold tracking-tight text-buet-red-dark">{title}</h1>
        <p className="mb-8 mt-4 max-w-2xl text-lg leading-8 text-neutral-600">{intro}</p>
        <EnquiryForm subject={subject} submitLabel={submitLabel} />
      </div>
    </div>
  );
}
