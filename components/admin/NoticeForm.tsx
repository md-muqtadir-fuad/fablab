"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { FileText } from "lucide-react";
import type { Notice } from "@/lib/server/notices";
import type { NoticeFormState } from "@/app/admin/notices/actions";
import { MAX_ATTACHMENT_MB, NOTICE_CATEGORIES as categories } from "@/lib/notice-format";
import { Button } from "@/components/ui/button";

function SubmitButtons({ published }: { published: boolean }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="submit" name="intent" value="publish" size="lg" disabled={pending}>{pending ? "Saving…" : published ? "Save and publish" : "Publish"}</Button>
      <Button type="submit" name="intent" value="draft" size="lg" variant="outline" disabled={pending}>Save as draft</Button>
    </div>
  );
}

function Hint({ id, children }: { id: string; children: React.ReactNode }) {
  return <span id={id} className="mt-1.5 block text-xs font-normal text-neutral-500">{children}</span>;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span id={id} className="mt-1.5 block text-sm font-semibold text-red-700">{message}</span> : null;
}

/** Links a field to its hint and error text for screen readers. */
const describe = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

export function NoticeForm({ action, notice, today }: { action: (state: NoticeFormState, form: FormData) => Promise<NoticeFormState>; notice?: Notice; today: string }) {
  const [state, formAction] = useActionState(action, {});
  const [fileError, setFileError] = useState("");
  const values = state.values ?? {
    title: notice?.title ?? "",
    body: notice?.body ?? "",
    category: notice?.category ?? "General",
    publish_at: notice?.publish_at ?? today,
    expires_at: notice?.expires_at ?? "",
    pinned: notice?.pinned ?? false,
  };
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="mt-6 space-y-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-8">
      {state.error && <p role="alert" className="form-error">{state.error}{state.values && " Any attached file needs to be chosen again."}</p>}

      <label className="form-label">Title
        <input className="form-field" name="title" required minLength={3} maxLength={200} defaultValue={values.title} aria-invalid={!!errors.title} aria-describedby={describe(errors.title && "title-error")} />
        <FieldError id="title-error" message={errors.title} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="form-label">Category
          <select className="form-field" name="category" defaultValue={values.category}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <FieldError id="category-error" message={errors.category} />
        </label>
        <label className="flex items-center gap-3 self-end rounded-xl border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800">
          <input type="checkbox" name="pinned" defaultChecked={values.pinned} className="h-4 w-4 accent-[#B5122A]" />
          Pin to the top of the notice board
        </label>
      </div>

      <label className="form-label">Notice text
        <textarea className="form-field min-h-56" name="body" required minLength={10} maxLength={10000} defaultValue={values.body} aria-invalid={!!errors.body} aria-describedby={describe("body-hint", errors.body && "body-error")} />
        <Hint id="body-hint">Line breaks are kept as written. Bangla and English are both fine.</Hint>
        <FieldError id="body-error" message={errors.body} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="form-label">Publish date
          <input type="date" className="form-field" name="publish_at" required defaultValue={values.publish_at} aria-invalid={!!errors.publish_at} aria-describedby={describe("publish-hint", errors.publish_at && "publish-error")} />
          <Hint id="publish-hint">Choose a future date to schedule the notice.</Hint>
          <FieldError id="publish-error" message={errors.publish_at} />
        </label>
        <label className="form-label">Show until (optional)
          <input type="date" className="form-field" name="expires_at" defaultValue={values.expires_at} aria-invalid={!!errors.expires_at} aria-describedby={describe("expires-hint", errors.expires_at && "expires-error")} />
          <Hint id="expires-hint">Last day the notice is shown. Leave empty to keep it up.</Hint>
          <FieldError id="expires-error" message={errors.expires_at} />
        </label>
      </div>

      <fieldset className="rounded-xl border border-dashed border-neutral-300 p-4 sm:p-5">
        <legend className="px-1 text-sm font-semibold text-neutral-800">Attachment (optional)</legend>
        {notice?.attachment_url && (
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
            <a href={notice.attachment_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-buet-red hover:underline"><FileText className="h-4 w-4" />{notice.attachment_name}</a>
            <label className="inline-flex items-center gap-2 text-neutral-700"><input type="checkbox" name="remove_attachment" className="accent-[#B5122A]" /> Remove this file</label>
          </div>
        )}
        <input type="file" name="attachment" aria-label="Attachment file" aria-describedby={describe("attachment-hint", (fileError || errors.attachment) && "attachment-error")} accept=".pdf,.jpg,.jpeg,.png,.webp" className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-red-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-buet-red hover:file:bg-red-100"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file && file.size > MAX_ATTACHMENT_MB * 1024 * 1024) { setFileError(`This file is larger than ${MAX_ATTACHMENT_MB} MB. Compress it or choose another.`); event.target.value = ""; }
            else setFileError("");
          }} />
        <Hint id="attachment-hint">PDF, JPG, PNG or WebP, up to {MAX_ATTACHMENT_MB} MB.{notice?.attachment_url && " A new file replaces the current one."}</Hint>
        <FieldError id="attachment-error" message={fileError || errors.attachment} />
      </fieldset>

      <div className="border-t border-neutral-200 pt-6">
        <SubmitButtons published={!!notice?.published} />
        <p className="mt-3 text-xs text-neutral-500">Drafts are saved but not shown on the website.</p>
      </div>
    </form>
  );
}
