import { OrdenEnPreparacion } from '@/app/api/queries';
import { NextResponse } from "next/server";
import { Producto } from '@/lib/db/schemes';

export async function GET(request: Request, { params }: { params: Promise<{ id_vendedor: string, id_orden: string }> }) {
    const { id_vendedor, id_orden } = await params;

    const apiKey = request.headers.get("seller_api_key");

    //if (apiKey !== "sas") {
    //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //}

    if (!id_vendedor) {
        return NextResponse.json({ error: "No se especifica vendedor", status: 400 });
    }

    if (!id_orden) {
        return NextResponse.json({ error: "No se especifica orden", status: 400 });
    }

    if (Number.isNaN(Number(id_orden))) {
        return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
    }

    const productosPorVendedores: Record<string, Producto> = {}


    //await OrdenAprobada(id_vendedor, Number(id_orden));

    console.log(id_vendedor);
    console.log(id_orden);

    return NextResponse.json({ estado: "en_preparacion" });
}