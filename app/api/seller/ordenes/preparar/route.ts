import { OrdenAprobada, OrdenEnPreparacion } from '@/app/api/queries';
import { NextResponse } from "next/server";

interface RequestTypes {
    id_vendedor: string;
    id_orden: number;
    productos_id: number[];
}

export async function POST(request: Request) {

    try {
        const apiKey = request.headers.get("seller_api_key");

        const body: RequestTypes = await request.json();

        const { id_vendedor, id_orden, productos_id } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        if (apiKey !== process.env.SELLER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!id_vendedor) {
            return NextResponse.json({ error: "No se especifica vendedor", status: 400 });
        }

        if (id_orden === null || id_orden === undefined) {
            return NextResponse.json({ error: "No se especifica orden", status: 400 });
        }

        if (Number.isNaN(Number(id_orden))) {
            return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
        }

        await OrdenAprobada(id_orden, id_vendedor, productos_id);

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log("POST api/seller/ordenes/preparar", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}