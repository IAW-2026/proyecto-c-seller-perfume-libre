import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {

    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            {
                error: "Unauthorized"
            },
            {
                status: 401
            }
        );
    }

    const formData = await request.formData();

    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json(
            {
                error: "No file"
            },
            {
                status: 400
            }
        );
    }

    const extension = file.name.split(".").pop();
    const nombreArchivo = `${crypto.randomUUID()}.${extension}`;

    const blob = await put(
        nombreArchivo,
        file,
        {
            access: "public"
        }
    );

    return NextResponse.json({ url: blob.url });
}