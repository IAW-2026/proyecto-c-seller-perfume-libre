import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {

    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { file } = body;

    if (!file) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    console.log(file);

    try {
        //await del(file);

        return NextResponse.json({ status: 201 });
    } catch (error) {
        console.error("Error al eliminar imagen:", error);

        return NextResponse.json({ error: "Error al eliminar la imagen" }, { status: 500 });
    }
}