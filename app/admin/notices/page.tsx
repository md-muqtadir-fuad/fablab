import Link from "next/link";
import { notFound } from "next/navigation";
import { Paperclip, Pin, Plus, Search } from "lucide-react";
import { contentEnabled } from "@/lib/features";
import { requireContentEditor } from "@/lib/server/auth";
import { listAllNotices, noticeStatus, type NoticeStatus } from "@/lib/server/notices";
import { formatDate } from "@/lib/notice-format";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Notices" };
export const dynamic = "force-dynamic";

const statusStyle: Record<NoticeStatus, string> = {
  published: "bg-emerald-50 text-emerald-800 border-emerald-200",
  draft: "bg-neutral-100 text-neutral-700 border-neutral-200",
  scheduled: "bg-blue-50 text-blue-800 border-blue-200",
  expired: "bg-amber-50 text-amber-800 border-amber-200",
};
const tabs: { value?: NoticeStatus; label: string }[] = [{ label: "All" }, { value: "published", label: "Published" }, { value: "scheduled", label: "Scheduled" }, { value: "draft", label: "Drafts" }, { value: "expired", label: "Expired" }];
const messages: Record<string, string> = { created: "Notice saved.", updated: "Changes saved.", deleted: "Notice deleted." };

export default async function AdminNotices({ searchParams }: { searchParams: Promise<{ status?: string; show?: string; q?: string }> }) {
  if (!contentEnabled()) notFound();
  await requireContentEditor("/admin/notices");
  const { status, show, q } = await searchParams;
  const query = (q || "").trim().toLowerCase();
  const all = (await listAllNotices()).map((notice) => ({ notice, state: noticeStatus(notice) }));
  const counts = all.reduce<Record<string, number>>((acc, { state }) => ({ ...acc, [state]: (acc[state] ?? 0) + 1 }), {});
  const shown = all.filter(({ notice, state }) => (!show || state === show) && (!query || `${notice.title} ${notice.body}`.toLowerCase().includes(query)));
  const link = (value?: string) => { const p = new URLSearchParams(); if (value) p.set("show", value); if (q) p.set("q", q); const s = p.toString(); return s ? `/admin/notices?${s}` : "/admin/notices"; };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-buet-red-dark">Notices</h1>
          <p className="mt-2 max-w-2xl text-neutral-600">Published notices appear on the public notice board and the homepage. Pinned notices stay at the top.</p>
        </div>
        <Button asChild><Link href="/admin/notices/new"><Plus /> New notice</Link></Button>
      </div>

      {status && messages[status] && <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{messages[status]}</p>}

      {!all.length ? (
        <div className="surface mt-8 text-center">
          <h2 className="text-xl font-bold">No notices yet</h2>
          <p className="mt-2 text-neutral-600">Create the first notice for the lab’s notice board.</p>
          <Button className="mt-5" asChild><Link href="/admin/notices/new">Create a notice</Link></Button>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <nav aria-label="Filter by status" className="flex gap-1 overflow-x-auto rounded-full border border-neutral-200 bg-white p-1">
              {tabs.map(({ value, label }) => {
                const active = (show || undefined) === value;
                const count = value ? counts[value] ?? 0 : all.length;
                return (
                  <Link key={label} href={link(value)} aria-current={active ? "page" : undefined} className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${active ? "bg-buet-red text-white" : "text-neutral-600 hover:bg-red-50 hover:text-buet-red"}`}>
                    {label} <span className={active ? "text-white/80" : "text-neutral-400"}>{count}</span>
                  </Link>
                );
              })}
            </nav>
            <form action="/admin/notices" role="search" className="relative w-full xl:max-w-xs">
              {show && <input type="hidden" name="show" value={show} />}
              <label htmlFor="admin-notice-search" className="sr-only">Search notices</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input id="admin-notice-search" type="search" name="q" defaultValue={q} placeholder="Search title or text" className="form-field mt-0 py-2.5 pl-11" />
            </form>
          </div>

          {!shown.length ? (
            <p className="surface mt-6 text-center text-neutral-600">No notices match this filter. <Link href="/admin/notices" className="font-semibold text-buet-red underline">Show all</Link></p>
          ) : (
            <ul className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {shown.map(({ notice, state }) => (
                <li key={notice.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`rounded-full border px-2.5 py-0.5 font-bold capitalize ${statusStyle[state]}`}>{state}</span>
                      <span className="font-semibold text-neutral-500">{notice.category}</span>
                      {notice.pinned && <span className="inline-flex items-center gap-1 font-semibold text-buet-red"><Pin className="h-3 w-3" /> Pinned</span>}
                      {notice.attachment_url && <span className="inline-flex items-center gap-1 text-neutral-500"><Paperclip className="h-3 w-3" /> Attachment</span>}
                    </div>
                    <h2 className="mt-2 break-words text-lg font-bold text-neutral-900">{notice.title}</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                      {state === "scheduled" ? "Goes live" : "Published"} {formatDate(notice.publish_at)}
                      {notice.expires_at && ` · Shown until ${formatDate(notice.expires_at)}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="ghost" size="sm" asChild><Link href={`/notices/${notice.id}`} target="_blank">{state === "published" ? "View" : "Preview"}</Link></Button>
                    <Button variant="outline" size="sm" asChild><Link href={`/admin/notices/${notice.id}/edit`}>Edit</Link></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
