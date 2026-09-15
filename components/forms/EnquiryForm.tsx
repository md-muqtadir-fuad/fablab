"use client";
import { FormEvent,useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses,dhakaDate } from "@/lib/booking";
export function EnquiryForm({subject,submitLabel="Submit request"}:{subject:string;submitLabel?:string}) {
  const [reference,setReference]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setBusy(true);setError("");const values=Object.fromEntries(new FormData(event.currentTarget));
    try {const response=await fetch("/api/requests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,subject,consent:values.consent==="on"})});const result=await response.json();if(!response.ok) throw new Error(result.error);setReference(result.id);}
    catch(error){setError(error instanceof Error ? error.message : "Unable to save your request. Please try again.");}finally{setBusy(false);}
  }
  if(reference) return <div role="status" className="border border-emerald-300 bg-emerald-50 p-8 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700"/><h2 className="mt-4 text-xl font-bold">Request saved</h2><p className="mt-3">Your {subject.toLowerCase()} is awaiting staff review. Keep your reference:</p><p className="my-4 break-all font-mono text-sm font-bold">{reference}</p><p className="text-sm text-neutral-600">Requests submitted while signed in appear in your <Link href="/dashboard" className="underline">dashboard</Link>. This website does not send automatic emails.</p><Button className="mt-6" variant="outline" onClick={()=>setReference("")}>Send another</Button></div>;
  return <form onSubmit={submit} className="space-y-5 border border-neutral-300 border-t-4 border-t-buet-red bg-white p-6">
    <p className="text-sm text-neutral-600"><Link href="/login" className="font-medium text-buet-red underline">Sign in</Link> before submitting to track this request in your dashboard. All fields are required.</p>
    <div className="grid gap-5 sm:grid-cols-2"><label className="form-label">Full name<input className="form-field" name="name" required minLength={2} maxLength={100} autoComplete="name"/></label><label className="form-label">Email<input className="form-field" type="email" name="email" required maxLength={254} autoComplete="email"/></label></div>
    <label className="form-label">Department or organisation<input className="form-field" name="organisation" required minLength={2} maxLength={200} autoComplete="organization"/></label>
    {subject==="Training registration" && <label className="form-label">Training course<select className="form-field" name="course" required defaultValue=""><option value="" disabled>Select a course</option>{courses.map(course=><option key={course}>{course}</option>)}</select></label>}
    {subject==="Visit request" && <div className="grid gap-5 sm:grid-cols-2"><label className="form-label">Preferred visit date<input type="date" className="form-field" name="date" required min={dhakaDate()}/><span className="text-xs text-neutral-500">Sunday–Thursday, from tomorrow, within 90 days.</span></label><label className="form-label">Number of visitors<input type="number" className="form-field" name="visitors" min={1} max={50} required defaultValue={1}/></label></div>}
    <label className="form-label">Tell us what you need<textarea className="form-field min-h-32" name="details" required minLength={20} maxLength={5000}/><span className="text-xs text-neutral-500">20–5,000 characters. Include dates, materials, and requirements.</span></label>
    <label className="flex items-start gap-3 text-sm text-neutral-600"><input className="mt-1" type="checkbox" name="consent" required/>I confirm that the information is accurate and agree to be contacted about this request.</label>
    {error && <p role="alert" className="form-error">{error}</p>}<Button type="submit" size="lg" disabled={busy}>{busy ? "Saving…" : submitLabel}</Button>
  </form>;
}
