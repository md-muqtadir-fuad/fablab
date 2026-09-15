import Link from "next/link";
import { Button } from "@/components/ui/button";
export const metadata = { title: "Page not found", robots: { index: false, follow: false } };
export default function MissingPage() { return <div className="flex flex-1 items-center justify-center px-4 py-20 text-center"><div><h1 className="text-4xl font-bold">Page not found</h1><p className="my-5 text-neutral-600">The page may have moved, or the address may be incorrect.</p><Button asChild><Link href="/">Return home</Link></Button></div></div>; }
