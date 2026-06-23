import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {

    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "El archivo debe ser una imagen valida (JPEG, PNG, WebP o GIF)" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "La imagen no puede exceder 5MB" }, { status: 400 });
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json({ error: "Extension de archivo no permitida" }, { status: 400 });
    }

    try {
        const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

        const blob = await put(
            nombreArchivo,
            file,
            {
                access: "public"
            }
        );

        return NextResponse.json({ url: blob.url });
    } catch (error) {
        console.error("Error al subir imagen:", error);

        return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 });
    }
}