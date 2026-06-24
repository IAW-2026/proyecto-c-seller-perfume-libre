import { NextResponse } from "next/server";
import { ObtenerProducto } from '../../../queries'

export async function GET(request: Request, { params }: { params: Promise<{ id_producto: string }> }) {

    try {
        const { id_producto } = await params;

        const apiKey = request.headers.get("api_key");

        if (!apiKey) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        if (apiKey !== process.env.SELLER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (Number.isNaN(Number(id_producto))) {
            return NextResponse.json({ error: "Id Invalido" }, { status: 400 });
        }

        const producto = await ObtenerProducto(Number(id_producto));

        if (!producto) {
            return NextResponse.json({ error: "No encontrado" }, { status: 404 });
        }

        return NextResponse.json(producto);

    } catch (error) {
        console.log("POST api/seller/productos/[id]", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}