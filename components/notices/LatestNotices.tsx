import Link from "next/link";
import { ArrowRight, Megaphone, Pin } from "lucide-react";
import { contentEnabled } from "@/lib/features";
import { listPublicNotices, safely } from "@/lib/server/notices";
import { formatDate } from "@/lib/notice-format";

/** Homepage strip with the three newest notices. Renders nothing when the feature is off, empty, or unavailable. */
export async function LatestNotices() {
  if (!contentEnabled()) return null;
  const { data: notices } = await safely(() => listPublicNotices({ limit: 3 }), []);
  if (!notices.length) return null;

  return (
    <section aria-labelledby="latest-notices" className="pt-10 sm:pt-14">
      <div className="section-shell">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="latest-notices" className="inline-flex items-center gap-3 text-lg font-bold text-buet-red-dark sm:text-xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-buet-red"><Megaphone className="h-4 w-4" /></span>
              Latest notices
            </h2>
            <Link href="/notices" className="inline-flex items-center gap-2 text-sm font-bold text-buet-red hover:underline">All notices <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {notices.map((notice) => (
              <li key={notice.id}>
                <Link href={`/notices/${notice.id}`} className="group block h-full rounded-xl border-l-4 border-buet-red bg-[#f8f5f0] p-4 transition hover:bg-[#fff1e3]">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    {formatDate(notice.publish_at)} · {notice.category}
                    {notice.pinned && <Pin aria-label="Pinned" className="h-3.5 w-3.5 text-buet-red" />}
                  </p>
                  <p className="mt-2 line-clamp-2 break-words font-bold leading-snug text-neutral-900 group-hover:text-buet-red">{notice.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
