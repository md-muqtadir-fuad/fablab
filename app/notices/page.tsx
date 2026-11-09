import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Paperclip, Pin, Search } from "lucide-react";
import { contentEnabled } from "@/lib/features";
import { NOTICE_CATEGORIES, safely, searchPublicNotices } from "@/lib/server/notices";
import { categoryStyles, dateParts, excerpt, NOTICES_PER_PAGE } from "@/lib/notice-format";

export const metadata = { title: "Notice board", description: "Announcements, training schedules, events, recruitment and closures at the Advanced Fabrication Lab." };
export const dynamic = "force-dynamic";

type Params = { category?: string; q?: string; page?: string };

/** Builds a /notices link that keeps the other filters. */
function href(current: Params, change: Partial<Params>) {
  const next = { ...current, ...change };
  const params = new URLSearchParams();
  if (next.category) params.set("category", next.category);
  if (next.q) params.set("q", next.q);
  if (next.page && next.page !== "1") params.set("page", next.page);
  const query = params.toString();
  return query ? `/notices?${query}` : "/notices";
}

export default async function NoticesPage({ searchParams }: { searchParams: Promise<Params> }) {
  if (!contentEnabled()) notFound();
  const params = await searchParams;
  const category = NOTICE_CATEGORIES.find((item) => item === params.category);
  const query = (params.q || "").trim().slice(0, 100);
  const current: Params = { category, q: query || undefined };
  const { data, failed } = await safely(
    () => searchPublicNotices({ category, query, page: Number(params.page) || 1, pageSize: NOTICES_PER_PAGE }),
    { notices: [], total: 0, page: 1, pages: 1 },
  );
  const { notices, total, page, pages } = data;
  const filtered = !!(category || query);

  return (
    <div className="bg-white pb-20 sm:pb-24">
      <section className="relative overflow-hidden bg-[#2b060d] text-white">
        <div className="absolute bottom-0 right-0 h-16 w-1/3 bg-buet-red [clip-path:polygon(20%_0,100%_0,100%_100%,0_100%)]" />
        <div className="section-shell relative py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#f1c77a]">Notice board</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">Notices &amp; announcements</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">Training schedules, events, recruitment, closures and other news from the Advanced Fabrication Lab.</p>
        </div>
      </section>

      <div className="section-shell pt-10 sm:pt-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Filter notices by category" className="flex flex-wrap gap-2">
            {[undefined, ...NOTICE_CATEGORIES].map((item) => {
              const active = item === category;
              return (
                <Link key={item ?? "all"} href={href(current, { category: item, page: undefined })} aria-current={active ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${active ? "border-buet-red bg-buet-red text-white" : "border-neutral-300 text-neutral-700 hover:border-buet-red hover:text-buet-red"}`}>
                  {item ?? "All"}
                </Link>
              );
            })}
          </nav>
          <form action="/notices" role="search" className="relative w-full lg:max-w-xs">
            {category && <input type="hidden" name="category" value={category} />}
            <label htmlFor="notice-search" className="sr-only">Search notices</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input id="notice-search" type="search" name="q" defaultValue={query} placeholder="Search notices" className="form-field mt-0 pl-11" />
          </form>
        </div>

        {!failed && (
          <p role="status" className="mt-6 text-sm font-semibold text-neutral-500">
            {total} {total === 1 ? "notice" : "notices"}{category && ` in ${category}`}{query && ` matching “${query}”`}
            {filtered && <> · <Link href="/notices" className="text-buet-red hover:underline">Clear filters</Link></>}
          </p>
        )}

        {failed ? (
          <p role="alert" className="surface mt-6 text-neutral-700">The notice board is temporarily unavailable. Please try again later.</p>
        ) : !notices.length ? (
          <div className="surface mt-6 text-center">
            <h2 className="text-xl font-bold text-buet-red-dark">{filtered ? "No matching notices" : "No notices right now"}</h2>
            <p className="mt-2 text-neutral-600">{filtered ? "Try another word or category." : "New announcements will appear here."}</p>
          </div>
        ) : (
          <ol className="mt-4 divide-y divide-neutral-200 border-y border-neutral-200">
            {notices.map((notice) => {
              const { day, month, year } = dateParts(notice.publish_at);
              return (
                <li key={notice.id}>
                  <Link href={`/notices/${notice.id}`} className="group grid grid-cols-[64px_minmax(0,1fr)] gap-4 py-6 transition-colors hover:bg-[#fff9f0] sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:gap-6 sm:px-4 sm:py-7">
                    <time dateTime={notice.publish_at} className="flex flex-col items-center justify-center self-start rounded-xl border border-neutral-200 bg-white py-2 text-center">
                      <span className="text-2xl font-bold leading-none text-buet-red-dark sm:text-3xl">{day}</span>
                      <span className="mt-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">{month} {year}</span>
                    </time>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${categoryStyles[notice.category] ?? categoryStyles.General}`}>{notice.category}</span>
                        {notice.pinned && <span className="inline-flex items-center gap-1 text-xs font-bold text-buet-red"><Pin className="h-3.5 w-3.5" /> Pinned</span>}
                        {notice.attachment_url && <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500"><Paperclip className="h-3.5 w-3.5" /> {notice.attachment_type === "application/pdf" ? "PDF" : "Image"}</span>}
                      </div>
                      <h2 className="mt-2 break-words text-xl font-bold leading-snug text-neutral-900 group-hover:text-buet-red sm:text-2xl">{notice.title}</h2>
                      <p className="mt-2 break-words leading-7 text-neutral-600">{excerpt(notice.body)}</p>
                    </div>
                    <ArrowRight className="hidden h-5 w-5 self-center text-neutral-400 transition group-hover:translate-x-1 group-hover:text-buet-red sm:block" />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}

        {pages > 1 && (
          <nav aria-label="Notice pages" className="mt-8 flex items-center justify-between gap-4">
            {page > 1 ? <Link href={href(current, { page: String(page - 1) })} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-buet-red hover:text-buet-red"><ArrowLeft className="h-4 w-4" /> Newer</Link> : <span />}
            <span className="text-sm font-semibold text-neutral-500">Page {page} of {pages}</span>
            {page < pages ? <Link href={href(current, { page: String(page + 1) })} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold hover:border-buet-red hover:text-buet-red">Older <ArrowRight className="h-4 w-4" /></Link> : <span />}
          </nav>
        )}
      </div>
    </div>
  );
}
