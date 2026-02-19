import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCachedSession } from "@/lib/cached-session";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  const session = await getCachedSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Type de fichier non autorisé. Utilisez JPG, PNG, WebP ou GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop volumineux. Taille maximale : 5 Mo." },
      { status: 400 }
    );
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `avatars/${session.user.id}.${ext}`;

  const blob = await put(filename, file, {
    access: "public",
    contentType: file.type,
    allowOverwrite: true,
  });

  return NextResponse.json({ url: blob.url });
}
