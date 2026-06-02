import { ObtenerSubOrdenes, OrdenRetirada } from '@/app/api/queries';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const apiKey = request.headers.get("seller_api_key");
    const id_orden = request.headers.get("id_orden");
    const tracking_id = request.headers.get("tracking_id");
    const fecha_retiro_req = request.headers.get("fecha_retiro");

    if (!tracking_id) {
        return NextResponse.json({ error: "No se especifica tracking id", status: 400 });
    }

    if (!id_orden) {
        return NextResponse.json({ error: "No se especifica orden", status: 400 });
    }

    if (!fecha_retiro_req) {
        return NextResponse.json({ error: "No se especifica fecha", status: 400 });
    }

    if (!apiKey) {
        return NextResponse.json({ error: "Unauthorized", status: 401 });
    }

    if (apiKey !== process.env.SELLER_API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fecha_retiro = new Date(fecha_retiro_req);

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

    for (const suborden of subordenes) {
        if (suborden.estado === "en_preparacion") {
            return NextResponse.json({ error: "Subordenes no hechas" }, { status: 400 });
        }
    }

    await OrdenRetirada(Number(id_orden), Number(tracking_id), fecha_retiro);

    return NextResponse.json({ status: 200 });
}