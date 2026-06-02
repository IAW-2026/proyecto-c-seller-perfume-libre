import { OrdenEnPreparacion } from '@/app/api/queries';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const apiKey = request.headers.get("seller_api_key");
    const id_vendedor = request.headers.get("id_vendedor");
    const id_orden = request.headers.get("id_orden");

    if (!id_vendedor) {
        return NextResponse.json({ error: "No se especifica vendedor", status: 400 });
    }

    if (!id_orden) {
        return NextResponse.json({ error: "No se especifica orden", status: 400 });
    }

    if (!apiKey) {
        return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (apiKey !== process.env.SELLER_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (Number.isNaN(Number(id_orden))) {
        return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
    }

    await OrdenEnPreparacion(id_vendedor, Number(id_orden));

    return NextResponse.json({ status: 200 });
}