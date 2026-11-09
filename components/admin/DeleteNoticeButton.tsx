"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="destructive" disabled={pending}>{pending ? "Deleting…" : "Yes, delete notice"}</Button>;
}

export function DeleteNoticeButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) return <Button type="button" variant="outline" className="mt-4 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800" onClick={() => setConfirming(true)}>Delete notice</Button>;
  return (
    <form action={action} className="mt-4 flex flex-wrap items-center gap-3">
      <span className="w-full text-sm font-semibold text-red-800">Delete this notice permanently?</span>
      <ConfirmButton />
      <Button type="button" variant="outline" onClick={() => setConfirming(false)}>Keep it</Button>
    </form>
  );
}
