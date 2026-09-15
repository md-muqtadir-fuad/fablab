"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export function RecordActions({id,kind,status,admin=false}:{id:string;kind:"bookings"|"requests";status:string;admin?:boolean}) {
  const router=useRouter(),[busy,setBusy]=useState(false),[error,setError]=useState(""),[confirm,setConfirm]=useState(false);
  async function act(next:string) {
    setBusy(true);setError("");
    try {const response=await fetch(admin ? "/api/admin" : `/api/bookings/${id}`,{method:admin ? "PATCH" : "DELETE",headers:{"Content-Type":"application/json"},body:admin ? JSON.stringify({id,kind,status:next}) : undefined});const result=await response.json();if(!response.ok) throw new Error(result.error);setConfirm(false);router.refresh();}catch(error){setError(error instanceof Error ? error.message : "Unable to update. Try again.");}finally{setBusy(false);}
  }
  return <div className="mt-4"><div className="flex flex-wrap gap-3">{admin ? <>{status==="pending" && <><Button disabled={busy} onClick={()=>act("approved")}>Approve</Button><Button disabled={busy} variant="outline" onClick={()=>act("rejected")}>Reject</Button></>}{status==="approved" && <Button disabled={busy} onClick={()=>act("completed")}>Mark completed</Button>}</> : ["pending","approved"].includes(status) && (confirm ? <><span className="w-full text-sm">Cancel this booking and release the session?</span><Button disabled={busy} onClick={()=>act("cancelled")}>Yes, cancel booking</Button><Button variant="outline" disabled={busy} onClick={()=>setConfirm(false)}>Keep booking</Button></> : <Button variant="outline" onClick={()=>setConfirm(true)}>Cancel booking</Button>)}</div>{error && <p role="alert" className="form-error mt-3">{error}</p>}</div>;
}
export function SignOut() {
  const [error,setError]=useState("");
  return <><Button variant="outline" onClick={async()=>{try{const response=await fetch("/api/auth",{method:"DELETE"});if(!response.ok)throw new Error();window.location.assign("/login");}catch{setError("Unable to sign out. Try again.");}}}>Sign out</Button>{error && <p role="alert">{error}</p>}</>;
}
