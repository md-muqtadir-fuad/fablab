"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Megaphone } from "lucide-react";

const icons = { requests: ClipboardList, notices: Megaphone };

export function AdminNav({ links }: { links: { href: string; label: string; icon: keyof typeof icons }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin navigation" className="flex gap-1 overflow-x-auto lg:flex-col">
      {links.map(({ href, label, icon }) => {
        const Icon = icons[icon];
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${active ? "bg-buet-red text-white" : "text-neutral-700 hover:bg-red-50 hover:text-buet-red"}`}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
