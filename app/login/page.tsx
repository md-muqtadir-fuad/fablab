"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }
  return (
    <div className="flex flex-1 items-center justify-center bg-neutral-50 px-4 py-16">
      <div className="w-full max-w-md border border-neutral-300 border-t-4 border-t-buet-red bg-white p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-buet-red">Member access</p>
        <h1 className="mt-2 text-3xl font-bold text-buet-red-dark">Sign in to FabLab</h1>
        <p className="mt-3 text-neutral-600">Use your BUET email to receive a secure sign-in link.</p>
        {sent ? (
          <div role="status" className="mt-7 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
            Check your inbox for a demonstration sign-in link. No email is sent by this local prototype.
          </div>
        ) : (
          <form className="mt-7 space-y-5" onSubmit={submit}>
            <label className="block text-sm font-medium">BUET email
              <input type="email" required autoComplete="email" placeholder="name@buet.ac.bd" className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 outline-none focus:border-buet-red focus:ring-2 focus:ring-buet-red/20" />
            </label>
            <Button className="w-full" size="lg" type="submit">Send secure link</Button>
          </form>
        )}
        <p className="mt-6 text-center text-xs text-neutral-500">Need public access? <Link className="text-buet-red hover:underline" href="/visit">Request a visit</Link>.</p>
      </div>
    </div>
  );
}
