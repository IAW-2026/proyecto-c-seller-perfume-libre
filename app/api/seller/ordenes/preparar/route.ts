import { OrdenAprobada, OrdenEnPreparacion, ReducirStock } from '@/app/api/queries';
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

interface RequestTypes {
    id_vendedor: string;
    id_orden: number;
    productos_id: number[];
}

export async function POST(request: Request) {

    try {

        const { userId } = await auth();

        const authConKey = !userId;

        const apiKey = request.headers.get("api_key");

        const body: RequestTypes = await request.json();

        const { id_vendedor, id_orden, productos_id } = body;

        if (authConKey && !apiKey) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (authConKey && apiKey !== process.env.SELLER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!id_vendedor) {
            return NextResponse.json({ error: "No se especifica vendedor" }, { status: 400 });
        }

        if (id_orden === null || id_orden === undefined) {
            return NextResponse.json({ error: "No se especifica orden" }, { status: 400 });
        }

        if (Number.isNaN(Number(id_orden))) {
            return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
        }

        // TODO: recibir cantidad para cada producto. falta charlarlo con shipping

        await OrdenAprobada(id_orden, id_vendedor, productos_id, 1);

        for (const id of productos_id) {
            ReducirStock(id, 1);
        }

        return NextResponse.json({ status: 200 });

    } catch (error) {
        console.log("POST api/seller/ordenes/preparar", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}