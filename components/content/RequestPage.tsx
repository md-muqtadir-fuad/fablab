import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export function RequestPage({ title, intro, subject, submitLabel }: { title: string; intro: string; subject: string; submitLabel?: string }) {
  return (
    <div className="py-16 lg:py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-buet-red hover:underline"><ArrowLeft className="h-4 w-4" /> Back to FabLab</Link>
          <p className="eyebrow mt-12">Send a request</p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-buet-red-dark sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">{intro}</p>
          <div className="mt-10 border-l-2 border-buet-red pl-5 text-sm leading-6 text-neutral-600">Give us enough detail to understand the work. The lab team will review your request and reply with the next step.</div>
        </div>
        <div className="surface"><EnquiryForm subject={subject} submitLabel={submitLabel} /></div>
      </div>
    </div>
  );
}
