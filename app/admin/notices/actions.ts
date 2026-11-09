"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canEditContent, currentUser } from "@/lib/server/auth";
import { contentEnabled } from "@/lib/features";
import { createNotice, deleteNotice, getNotice, NOTICE_CATEGORIES, updateNotice, type NoticeCategory, type NoticeInput } from "@/lib/server/notices";
import { deleteFile, extensionOf, FILE_TYPES, looksLike, saveFile } from "@/lib/server/storage";
import { dhakaDate } from "@/lib/booking";
import { MAX_ATTACHMENT_MB } from "@/lib/notice-format";

export type NoticeFormValues = { title: string; body: string; category: string; publish_at: string; expires_at: string; pinned: boolean };
export type NoticeFormState = { error?: string; fieldErrors?: Partial<Record<keyof NoticeFormValues | "attachment", string>>; values?: NoticeFormValues };

/** The signed-in editor, or null if the session expired or the account lost access. */
async function editor() {
  const user = await currentUser();
  return contentEnabled() && canEditContent(user) ? user : null;
}
const signedOut = "Your session has ended. Sign in again in a new tab, then press save again — your text is still here.";

const isDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);

function refresh(id?: string) {
  revalidatePath("/");
  revalidatePath("/notices");
  if (id) revalidatePath(`/notices/${id}`);
  revalidatePath("/admin/notices");
}

/** Creates a notice (no id) or updates one (with id). Used by the notice form. */
export async function saveNoticeAction(id: string | null, _previous: NoticeFormState, form: FormData): Promise<NoticeFormState> {
  const user = await editor();
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const values: NoticeFormValues = {
    title: text("title"),
    body: text("body"),
    category: text("category"),
    publish_at: text("publish_at") || dhakaDate(),
    expires_at: text("expires_at"),
    pinned: form.get("pinned") === "on",
  };
  if (!user) return { error: signedOut, values };
  const published = form.get("intent") !== "draft";
  const fieldErrors: NoticeFormState["fieldErrors"] = {};

  if (values.title.length < 3 || values.title.length > 200) fieldErrors.title = "Write a title of 3–200 characters.";
  if (values.body.length < 10 || values.body.length > 10000) fieldErrors.body = "Write the notice in 10–10,000 characters.";
  if (!NOTICE_CATEGORIES.includes(values.category as NoticeCategory)) fieldErrors.category = "Choose a category.";
  if (!isDate(values.publish_at)) fieldErrors.publish_at = "Choose a valid date.";
  if (values.expires_at && (!isDate(values.expires_at) || values.expires_at < values.publish_at)) fieldErrors.expires_at = "The last day must be on or after the publish date.";

  const existing = id ? await getNotice(id) : undefined;
  if (id && !existing) return { error: "This notice no longer exists. It may have been deleted.", values };

  const upload = form.get("attachment");
  const file = upload instanceof File && upload.size > 0 ? upload : null;
  if (file) {
    const ext = extensionOf(file.name);
    if (!FILE_TYPES[ext]) fieldErrors.attachment = "Attach a PDF, JPG, PNG or WebP file.";
    else if (file.size > MAX_ATTACHMENT_MB * 1024 * 1024) fieldErrors.attachment = `The file must be ${MAX_ATTACHMENT_MB} MB or smaller.`;
    else if (!looksLike(ext, new Uint8Array(await file.slice(0, 16).arrayBuffer()))) fieldErrors.attachment = "This file does not look like a real PDF or image. Export it again and retry.";
  }
  if (Object.keys(fieldErrors).length) return { error: "Please fix the highlighted fields.", fieldErrors, values };

  let attachment = { url: existing?.attachment_url ?? null, name: existing?.attachment_name ?? null, type: existing?.attachment_type ?? null };
  const removeOld = !!existing?.attachment_url && (!!file || form.get("remove_attachment") === "on");
  if (removeOld) attachment = { url: null, name: null, type: null };
  if (file) {
    try {
      const saved = await saveFile(file, "notices");
      attachment = { url: saved.url, name: saved.name, type: saved.type };
    } catch (error) {
      console.error("Attachment upload failed", error);
      return { error: "The attachment could not be saved. Try again, or save without it.", values };
    }
  }

  const input: NoticeInput = {
    title: values.title,
    body: values.body,
    category: values.category as NoticeCategory,
    pinned: values.pinned,
    published,
    publish_at: values.publish_at,
    expires_at: values.expires_at || null,
    attachment_url: attachment.url,
    attachment_name: attachment.name,
    attachment_type: attachment.type,
  };

  let savedId = id;
  try {
    if (id) await updateNotice(id, input);
    else savedId = await createNotice(input, user.id);
  } catch (error) {
    console.error("Notice could not be saved", error);
    if (file) await deleteFile(attachment.url); // do not leave an unused upload behind
    return { error: "The notice could not be saved. Please try again.", values };
  }
  if (removeOld) await deleteFile(existing?.attachment_url);

  refresh(savedId ?? undefined);
  redirect(`/admin/notices?status=${id ? "updated" : "created"}`);
}

export async function deleteNoticeAction(id: string) {
  if (!await editor()) redirect(`/login?next=/admin/notices/${id}/edit`);
  const notice = await getNotice(id);
  if (notice) {
    await deleteNotice(id);
    await deleteFile(notice.attachment_url);
  }
  refresh(id);
  redirect("/admin/notices?status=deleted");
}
