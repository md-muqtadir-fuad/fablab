import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LayoutDashboard } from "lucide-react";
import { canEditContent, isAdmin, requireContentEditor } from "@/lib/server/auth";
import { contentEnabled } from "@/lib/features";
import { AdminNav } from "@/components/admin/AdminNav";
import { SignOut } from "@/components/forms/RecordActions";

export const metadata: Metadata = { title: { default: "Admin panel", template: "%s | Admin panel" }, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireContentEditor("/admin");
  const role = isAdmin(user) ? "Administrator" : "Editor";
  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "?";
  const links = [
    ...(isAdmin(user) ? [{ href: "/admin", label: "Bookings & requests", icon: "requests" as const }] : []),
    ...(contentEnabled() && canEditContent(user) ? [{ href: "/admin/notices", label: "Notices", icon: "notices" as const }] : []),
  ];
  return (
    <div className="flex-1 bg-[#f6f3ee]">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:py-10">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="flex items-center gap-2.5 bg-[#2b060d] px-4 py-3 text-white">
              <LayoutDashboard className="h-4 w-4 text-[#f1c77a]" />
              <span className="text-sm font-bold tracking-wide">Admin panel</span>
              <span className="ml-auto truncate text-xs text-white/70 lg:hidden">{user.name} · {role}</span>
            </div>
            <div className="hidden items-center gap-3 border-b border-neutral-200 px-4 py-4 lg:flex">
              <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-buet-red ring-1 ring-red-100">{initials}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-neutral-900">{user.name}</p>
                <p className="truncate text-xs text-neutral-500" title={user.email}>{role}</p>
              </div>
            </div>
            <div className="p-3">
              <AdminNav links={links} />
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-neutral-200 px-4 py-3 text-sm">
              <Link href="/" className="inline-flex items-center gap-1.5 font-semibold text-buet-red hover:underline">View site <ExternalLink className="h-3.5 w-3.5" /></Link>
              <SignOut />
            </div>
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
