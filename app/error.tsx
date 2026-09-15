"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({reset}:{error:Error;reset:()=>void}) {return <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-3xl font-bold">Something went wrong</h1><p className="my-5 text-neutral-600">We could not load this page. Please try again.</p><Button onClick={reset}>Try again</Button></div>;}
