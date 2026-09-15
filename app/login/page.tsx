"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function LoginPage() {
  const [mode,setMode]=useState("login"), [busy,setBusy]=useState(false), [error,setError]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const values=Object.fromEntries(new FormData(event.currentTarget));
    try { const response=await fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...values,mode})}); const result=await response.json(); if(!response.ok) throw new Error(result.error); const next=new URLSearchParams(window.location.search).get("next"); window.location.assign(next && /^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(next) ? next : "/dashboard"); }
    catch(error) {setError(error instanceof Error ? error.message : "Unable to sign in. Try again.");setBusy(false);}
  }
  return <div className="flex flex-1 items-center justify-center px-4 py-16"><div className="w-full max-w-md border border-neutral-300 border-t-4 border-t-buet-red bg-white p-8">
    <p className="text-sm font-semibold uppercase tracking-wider text-buet-red">Member access</p><h1 className="mt-2 text-3xl font-bold text-buet-red-dark">{mode==="login" ? "Sign in to FabLab" : "Create your account"}</h1><p className="mt-3 text-neutral-600">Manage your bookings and follow the progress of your requests.</p>
    <form className="mt-7 space-y-5" onSubmit={submit}>
      {mode==="register" && <label className="form-label">Full name<input className="form-field" name="name" autoComplete="name" required minLength={2} maxLength={100}/></label>}
      <label className="form-label">Email<input className="form-field" type="email" name="email" autoComplete="email" required maxLength={254}/></label>
      <label className="form-label">Password<input className="form-field" type="password" name="password" autoComplete={mode==="login" ? "current-password" : "new-password"} required minLength={12} maxLength={128}/><span className="mt-1 block text-xs text-neutral-500">At least 12 characters.</span></label>
      {error && <p role="alert" className="form-error">{error}</p>}<Button className="w-full" size="lg" disabled={busy}>{busy ? "Please wait…" : mode==="login" ? "Sign in" : "Create account"}</Button>
    </form>
    <Button variant="link" className="mt-4 h-auto whitespace-normal px-0" disabled={busy} onClick={()=>{setMode(mode==="login" ? "register" : "login");setError("");}}>{mode==="login" ? "New to FabLab? Create an account" : "Already a member? Sign in"}</Button>
    <p className="mt-5 text-xs leading-5 text-neutral-500">Accounts do not grant machine certification. Staff review training before approving bookings. For account help, <Link href="/consultation" className="underline">contact the team</Link>.</p>
  </div></div>;
}
