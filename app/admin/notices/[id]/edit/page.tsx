import Link from "next/link";
import { notFound } from "next/navigation";
import { contentEnabled } from "@/lib/features";
import { requireContentEditor } from "@/lib/server/auth";
import { getNotice } from "@/lib/server/notices";
import { dhakaDate } from "@/lib/booking";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { DeleteNoticeButton } from "@/components/admin/DeleteNoticeButton";
import { deleteNoticeAction, saveNoticeAction } from "../../actions";

export const metadata = { title: "Edit notice" };
export const dynamic = "force-dynamic";

export default async function EditNotice({ params }: { params: Promise<{ id: string }> }) {
  if (!contentEnabled()) notFound();
  const { id } = await params;
  await requireContentEditor(`/admin/notices/${id}/edit`);
  const notice = await getNotice(id);
  if (!notice) notFound();
  return (
    <div>
      <Link href="/admin/notices" className="text-sm font-semibold text-buet-red hover:underline">← All notices</Link>
      <h1 className="mt-4 text-3xl font-bold text-buet-red-dark">Edit notice</h1>
      <NoticeForm action={saveNoticeAction.bind(null, notice.id)} notice={notice} today={dhakaDate()} />
      <section className="mt-8 rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-bold text-neutral-900">Delete this notice</h2>
        <p className="mt-1 text-sm text-neutral-600">It will disappear from the website straight away, together with its attachment. This cannot be undone. To hide it temporarily, save it as a draft instead.</p>
        <DeleteNoticeButton action={deleteNoticeAction.bind(null, notice.id)} />
      </section>
    </div>
  );
}
