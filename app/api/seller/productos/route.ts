import { NextResponse } from "next/server";
import { ObtenerProductosBusqueda, ObtenerCantidadDeResultados } from '@/app/api/queries';
import { json } from "stream/consumers";

export async function GET(request: Request) {

    try {
        const titulo = request.headers.get("titulo");
        const categorias = JSON.parse(request.headers.get("categorias") ?? "[]") as string[];
        const apiKey = request.headers.get("seller_api_key");
        const pagina = request.headers.get("pagina");
        const cantidadPorPagina = request.headers.get("cantidad_pagina");

        if (!apiKey) {
            return NextResponse.json({ error: "Unauthorized", status: 401 });
        }

        if (apiKey !== process.env.SELLER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!Array.isArray(categorias) || !categorias.every(c => typeof c === "string")) {
            return NextResponse.json({ error: "Categorias invalidas" }, { status: 400 });
        }

        if (!titulo) {
            return NextResponse.json({ error: "No hay titulo en el request", status: 400 });
        }

        if (pagina === undefined || pagina === null) {
            return NextResponse.json({ error: "No se especifica pagina", status: 400 });
        }

        if (!cantidadPorPagina) {
            return NextResponse.json({ error: "No se especifica cantidad por pagina", status: 400 });
        }

        const productos = await ObtenerProductosBusqueda(titulo, categorias.map(c => c.toLowerCase()), Number(pagina), Number(cantidadPorPagina));
        const cantidadDeProductos = await ObtenerCantidadDeResultados(titulo, categorias.map(c => c.toLowerCase()));

        return NextResponse.json({ items: productos, total: cantidadDeProductos });
    } catch (error) {
        console.log("POST api/seller/productos", error);

        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }


}