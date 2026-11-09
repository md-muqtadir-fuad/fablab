import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Where public files (notice attachments, later gallery photos) are kept.
//  - Default: the local `storage/` folder, served at /files/... (BUET server, your PC)
//  - With BLOB_READ_WRITE_TOKEN set: Vercel Blob (for the Vercel demo)
// The rest of the code only calls saveFile / deleteFile and never needs to know which.

export type StoredFile = { url: string; name: string; type: string; size: number };

export const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function storageDir() {
  return path.resolve(process.env.STORAGE_DIR || "storage");
}

function blobConfigured() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export function extensionOf(name: string) {
  return (name.split(".").pop() || "").toLowerCase();
}

/** Keeps letters, digits, dot, dash and underscore so names are safe in URLs and on disk. */
export function safeFileName(name: string) {
  const ext = extensionOf(name);
  const base = name.slice(0, name.length - ext.length - 1).normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
  return `${base}.${ext}`;
}

/** Checks the first bytes so a renamed file cannot pretend to be a PDF or image. */
export function looksLike(ext: string, bytes: Uint8Array) {
  const starts = (...sig: number[]) => sig.every((value, index) => bytes[index] === value);
  if (ext === "pdf") return starts(0x25, 0x50, 0x44, 0x46); // %PDF
  if (ext === "png") return starts(0x89, 0x50, 0x4e, 0x47);
  if (ext === "jpg" || ext === "jpeg") return starts(0xff, 0xd8, 0xff);
  if (ext === "webp") return starts(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  return false;
}

/** Saves an uploaded file under `folder` and returns its public URL. */
export async function saveFile(file: File, folder: string): Promise<StoredFile> {
  const ext = extensionOf(file.name);
  const type = FILE_TYPES[ext];
  if (!type) throw new Error(`File type .${ext} is not allowed.`);
  const key = `${folder}/${randomUUID().slice(0, 8)}-${safeFileName(file.name)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (blobConfigured()) {
    const { put } = await import("@vercel/blob");
    const blob = await put(key, Buffer.from(bytes), { access: "public", contentType: type, addRandomSuffix: false });
    return { url: blob.url, name: file.name, type, size: file.size };
  }
  const target = path.join(storageDir(), ...key.split("/"));
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, bytes);
  return { url: `/files/${key}`, name: file.name, type, size: file.size };
}

/** Removes a file saved by saveFile. Missing files are ignored. */
export async function deleteFile(url: string | null | undefined) {
  if (!url) return;
  try {
    if (url.startsWith("/files/")) {
      const target = localPath(url.slice("/files/".length).split("/"));
      if (target) await unlink(target);
    } else if (blobConfigured()) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }
  } catch (error) {
    if ((error as { code?: string }).code !== "ENOENT") console.error("Could not delete file", url, error);
  }
}

/** Resolves /files/... segments to a path inside the storage folder, or null if unsafe. */
export function localPath(segments: string[]) {
  if (!segments.length || segments.some((part) => !/^[a-zA-Z0-9_-][a-zA-Z0-9._-]*$/.test(part))) return null;
  const root = storageDir();
  const target = path.resolve(root, ...segments);
  return target.startsWith(root + path.sep) ? target : null;
}

export async function readLocalFile(segments: string[]) {
  const target = localPath(segments);
  if (!target) return null;
  try {
    return await readFile(target);
  } catch {
    return null;
  }
}
