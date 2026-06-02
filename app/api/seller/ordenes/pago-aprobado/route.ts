import { OrdenAprobada } from '@/app/api/queries';
import { NextResponse } from "next/server";
import { Producto } from '@/lib/db/schemes';

export async function GET(request: Request) {
    const apiKey = request.headers.get("seller_api_key");
    const id_pago = request.headers.get("id_pago");
    const id_orden = request.headers.get("id_orden");

    if (!id_orden) {
        return NextResponse.json({ error: "No se especifica orden", status: 400 });
    }

    if (!id_pago) {
        return NextResponse.json({ error: "No se especifica id pago", status: 400 });
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

    // TODO: falta decidir exactamente que recibo de payment para separar en subordenes, pero se espera que contenga
    // producto_id[] y de ahi separo por user_id.

    // const productosPorVendedores: Record<string, Producto> = {}

    await OrdenAprobada(Number(id_orden), "user_3EDuXdnJ2Hg5p7IUuHunI8Bm066", [4]);

    return NextResponse.json({ status: 200 });
}