import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { promises as fs } from "node:fs";
import { join } from "node:path";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const UPLOAD_DIR = join(process.cwd(), "uploads");

function sanitizeFilename(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const safeExt = ALLOWED_EXTENSIONS.includes(`.${ext}`) ? ext : "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${timestamp}-${random}.${safeExt}`;
}

function isSafeImageType(type: string): boolean {
  return ALLOWED_TYPES.includes(type);
}

export const uploadImage = createServerFn({ method: "POST" })
  .validator(z.object({ dataUrl: z.string().max(2_000_000) }))
  .handler(async ({ data }) => {
    const match = data.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new Error("فرمت تصویر نامعتبر است.");
    }
    const mimeType = match[1].toLowerCase();
    if (!isSafeImageType(mimeType)) {
      throw new Error("فرمت فایل مجاز نیست. فقط JPG, PNG, WebP.");
    }
    const buffer = Buffer.from(match[2], "base64");
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error("حجم تصویر بیش از 2MB است.");
    }
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = sanitizeFilename(`upload.${mimeType.split("/")[1]}`);
    const filepath = join(UPLOAD_DIR, filename);
    await fs.writeFile(filepath, buffer);
    return { path: `/uploads/${filename}` };
  });
