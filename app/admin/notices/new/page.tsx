import Link from "next/link";
import { notFound } from "next/navigation";
import { contentEnabled } from "@/lib/features";
import { requireContentEditor } from "@/lib/server/auth";
import { dhakaDate } from "@/lib/booking";
import { NoticeForm } from "@/components/admin/NoticeForm";
import { saveNoticeAction } from "../actions";

export const metadata = { title: "New notice" };

export default async function NewNotice() {
  if (!contentEnabled()) notFound();
  await requireContentEditor("/admin/notices/new");
  return (
    <div>
      <Link href="/admin/notices" className="text-sm font-semibold text-buet-red hover:underline">← All notices</Link>
      <h1 className="mt-4 text-3xl font-bold text-buet-red-dark">New notice</h1>
      <NoticeForm action={saveNoticeAction.bind(null, null)} today={dhakaDate()} />
    </div>
  );
}
