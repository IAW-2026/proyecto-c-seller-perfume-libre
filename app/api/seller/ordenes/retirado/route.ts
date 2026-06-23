import { ObtenerSubOrdenes, OrdenRetirada } from '@/app/api/queries';
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        const apiKey = request.headers.get("seller_api_key");

        const body = await request.json();

        const { id_orden, tracking_id, fecha_retiro } = body;

        if (!apiKey) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        if (apiKey !== process.env.SELLER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!tracking_id) {
            return NextResponse.json({ error: "No se especifica tracking id", status: 400 });
        }

        if (id_orden === null || id_orden === undefined) {
            return NextResponse.json({ error: "No se especifica orden", status: 400 });
        }

        if (!fecha_retiro) {
            return NextResponse.json({ error: "No se especifica fecha", status: 400 });
        }

        const fechaRetiro = new Date(fecha_retiro);

        if (Number.isNaN(fecha_retiro.getTime())) {
            return NextResponse.json({ error: "Fecha invalida" }, { status: 400 });
        }

        if (Number.isNaN(Number(id_orden))) {
            return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
        }

        if (Number.isNaN(Number(tracking_id))) {
            return NextResponse.json({ error: "Id orden invalido" }, { status: 400 });
        }

        const subordenes = await ObtenerSubOrdenes(Number(id_orden));

        if (subordenes.length === 0) {
            return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
        }

        for (const suborden of subordenes) {
            if (suborden.estado === "en_preparacion") {
                return NextResponse.json({ error: "Subordenes no hechas" }, { status: 400 });
            }
        }

        await OrdenRetirada(Number(id_orden), Number(tracking_id), fechaRetiro);

        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.log("POST api/seller/ordenes/retirado", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}