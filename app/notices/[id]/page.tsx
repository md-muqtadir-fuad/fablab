import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye, ExternalLink, FileText, Pin } from "lucide-react";
import { contentEnabled } from "@/lib/features";
import { canEditContent, currentUser } from "@/lib/server/auth";
import { getNotice, getPublicNotice, noticeStatus, safely } from "@/lib/server/notices";
import { categoryStyles, excerpt, formatDate } from "@/lib/notice-format";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

/** Public notices for everyone; drafts, scheduled and expired notices only for staff (as a preview). */
async function load(id: string) {
  if (!contentEnabled()) return { notice: undefined, preview: false };
  const notice = (await safely(() => getPublicNotice(id), undefined)).data;
  if (notice) return { notice, preview: false };
  if (!canEditContent(await currentUser())) return { notice: undefined, preview: false };
  return { notice: (await safely(() => getNotice(id), undefined)).data, preview: true };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { notice, preview } = await load((await params).id);
  if (!notice) return { title: "Notice not found" };
  return { title: notice.title, description: excerpt(notice.body, 150), robots: preview ? { index: false, follow: false } : undefined };
}

const previewText = { draft: "This is a draft.", scheduled: "This notice is scheduled and not public yet.", expired: "This notice has expired and is no longer public.", published: "" };

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { notice, preview } = await load((await params).id);
  if (!notice) notFound();
  const isImage = notice.attachment_type?.startsWith("image/");

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      {preview && (
        <div role="status" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <span className="inline-flex items-center gap-2 font-semibold"><Eye className="h-4 w-4" /> Staff preview. {previewText[noticeStatus(notice)]} Visitors cannot see this page.</span>
          <Link href={`/admin/notices/${notice.id}/edit`} className="font-bold underline">Edit notice</Link>
        </div>
      )}
      <Link href="/notices" className="text-sm font-semibold text-buet-red hover:underline">← All notices</Link>
      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${categoryStyles[notice.category] ?? categoryStyles.General}`}>{notice.category}</span>
        <time dateTime={notice.publish_at} className="font-semibold text-neutral-500">{formatDate(notice.publish_at)}</time>
        {notice.pinned && <span className="inline-flex items-center gap-1 font-bold text-buet-red"><Pin className="h-3.5 w-3.5" /> Pinned</span>}
      </div>
      <h1 className="mt-4 break-words text-3xl font-bold leading-tight text-buet-red-dark sm:text-5xl">{notice.title}</h1>
      <div className="mt-8 whitespace-pre-line break-words text-lg leading-8 text-neutral-800">{notice.body}</div>
      {notice.expires_at && <p className="mt-8 text-sm text-neutral-500">This notice is shown until {formatDate(notice.expires_at)}.</p>}

      {notice.attachment_url && (
        <section aria-label="Attachment" className="mt-10 rounded-2xl border border-neutral-200 bg-[#f8f5f0] p-5 sm:p-6">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element -- files may live on Vercel Blob or the local server
            <img src={notice.attachment_url} alt={`Attachment for ${notice.title}`} className="mb-5 max-h-[560px] w-full rounded-xl bg-white object-contain" />
          )}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="inline-flex min-w-0 items-center gap-2 font-semibold text-neutral-800"><FileText className="h-5 w-5 shrink-0 text-buet-red" /><span className="truncate">{notice.attachment_name}</span></p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild><a href={notice.attachment_url} target="_blank" rel="noopener noreferrer">Open <ExternalLink /></a></Button>
              <Button size="sm" asChild><a href={notice.attachment_url} download={notice.attachment_name ?? true}>Download <Download /></a></Button>
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
