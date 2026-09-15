"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  ["Explore", "/explore"], ["Make", "/make"], ["Learn", "/learn"], ["Research", "/research"],
  ["Collaborate", "/collaborate"], ["Community", "/community"], ["About", "/about"],
];

export default function MainHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-[0_4px_24px_rgba(56,28,24,.06)] backdrop-blur-xl" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); document.getElementById("menu-toggle")?.focus(); } }}>
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Advanced Fabrication Lab home">
          <Image src="/logos/advanced-fabrication-lab.png" alt="" width={48} height={58} priority className="h-[54px] w-11 object-contain" />
          <span className="border-l border-neutral-200 pl-3">
            <span className="block font-serif text-xl font-bold leading-none tracking-tight text-buet-red-dark">Advanced Fabrication Lab</span>
            <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[.18em] text-neutral-500">IAT, BUET</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 xl:flex">
          {navigation.map(([label, href]) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${active ? "bg-red-50 text-buet-red" : "text-neutral-700 hover:bg-neutral-100 hover:text-buet-red"}`}>{label}</Link>;
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link href="/equipment" aria-label="Browse equipment catalogue" className="rounded-full p-2.5 text-neutral-600 hover:bg-neutral-100 hover:text-buet-red"><Search className="h-5 w-5" /></Link>
          <Link href="/projects/start" className="inline-flex h-11 items-center gap-2 rounded-full bg-buet-red px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(181,18,42,.22)] transition hover:-translate-y-0.5 hover:bg-buet-red-dark">Start a project <ArrowUpRight className="h-4 w-4" /></Link>
        </div>

        <button id="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="rounded-full border border-neutral-200 p-2.5 text-buet-red-dark xl:hidden"><span className="sr-only">{open ? "Close main menu" : "Open main menu"}</span>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-74px)] overflow-auto border-t border-neutral-200 bg-white px-4 py-5 xl:hidden"><div className="mx-auto grid max-w-2xl gap-1">{navigation.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-lg font-semibold text-neutral-800 hover:bg-red-50 hover:text-buet-red">{label}</Link>)}<div className="mt-4 grid grid-cols-2 gap-3 border-t pt-5"><Link href="/equipment" onClick={() => setOpen(false)} className="rounded-full border border-neutral-300 px-4 py-3 text-center text-sm font-bold">Equipment</Link><Link href="/projects/start" onClick={() => setOpen(false)} className="rounded-full bg-buet-red px-4 py-3 text-center text-sm font-bold text-white">Start a project</Link></div></div></nav>}
    </header>
  );
}
