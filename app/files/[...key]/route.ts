import { extensionOf, FILE_TYPES, readLocalFile } from "@/lib/server/storage";

// Serves files saved in the local storage/ folder (notice PDFs, images).
// Only allowed file types are served, and only from inside storage/.
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const name = key[key.length - 1] || "";
  const type = FILE_TYPES[extensionOf(name)];
  const content = type ? await readLocalFile(key) : null;
  if (!type || !content) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(content), {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `inline; filename="${name}"`,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
