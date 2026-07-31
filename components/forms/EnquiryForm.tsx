"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EnquiryForm({ subject, submitLabel = "Submit request" }: { subject: string; submitLabel?: string }) {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div role="status" className="border border-emerald-300 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h2 className="mt-4 text-xl font-bold text-neutral-900">Request received</h2>
        <p className="mt-2 text-neutral-600">The FabLab team will review your {subject.toLowerCase()} and contact you within two working days.</p>
        <Button className="mt-6" variant="outline" onClick={() => setSubmitted(false)}>Send another</Button>
      </div>
    );
  }

  const field = "mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-buet-red focus:ring-2 focus:ring-buet-red/20";
  return (
    <form onSubmit={submit} className="space-y-5 border border-neutral-300 border-t-4 border-t-buet-red bg-white p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium">Full name<input className={field} name="name" required autoComplete="name" /></label>
        <label className="text-sm font-medium">Email<input className={field} type="email" name="email" required autoComplete="email" /></label>
      </div>
      <label className="block text-sm font-medium">Department or organisation<input className={field} name="organisation" required /></label>
      <label className="block text-sm font-medium">Tell us what you need<textarea className={`${field} min-h-32`} name="details" required /></label>
      <label className="flex items-start gap-3 text-sm text-neutral-600">
        <input className="mt-1" type="checkbox" required />
        I confirm that the information is accurate and agree to be contacted about this request.
      </label>
      <Button type="submit" size="lg">{submitLabel}</Button>
    </form>
  );
}
