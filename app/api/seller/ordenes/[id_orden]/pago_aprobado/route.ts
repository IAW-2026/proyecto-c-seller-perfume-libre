import { OrdenEnPreparacion } from '@/app/api/queries';
import { NextResponse } from "next/server";
import { Producto } from '@/lib/db/schemes';

export async function GET(request: Request, { params }: { params: Promise<{id_orden: string }> }) {
    const { id_orden } = await params;

    const apiKey = request.headers.get("seller_api_key");
    const id_pago = request.headers.get("id_pago");
    const estado = request.headers.get("estado");

    //if (apiKey !== "sas") {
    //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //}

    if (!id_orden) {
        return NextResponse.json({ error: "No se especifica orden", status: 400 });
    }

    if (!id_pago) {
        return NextResponse.json({ error: "No se especifica id pago", status: 400 });
    }

    if (!estado) {
        return NextResponse.json({ error: "No se especifica estado", status: 400 });
    }

    if (Number.isNaN(Number(id_orden))) {
        return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
    }

    const productosPorVendedores: Record<string, Producto> = {}


    //await OrdenAprobada(id_vendedor, Number(id_orden));

    console.log(id_orden);
    console.log(id_pago);
    console.log(estado);

    return NextResponse.json({ status: 200 });
}