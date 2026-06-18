import { OrdenAprobada } from '@/app/api/queries';
import { NextResponse } from "next/server";
import { Producto } from '@/lib/db/schemes';

export async function POST(request: Request) {
    const apiKey = request.headers.get("seller_api_key");
    const id_orden = request.headers.get("id_orden");
    const body = await request.json();

    if (!id_orden) {
        return NextResponse.json({ error: "No se especifica orden", status: 400 });
    }

    if (!body) {
        return NextResponse.json({ error: "No se especifican productos", status: 400 });
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

    // TODO: restar stock en tabla producto

    //await OrdenAprobada(Number(id_orden), "user_3EDuXdnJ2Hg5p7IUuHunI8Bm066", [4]);

    console.log(apiKey);
    console.log(id_orden);
    console.log(body);

    return NextResponse.json({ status: 200 });
}