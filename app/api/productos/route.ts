import { NextResponse } from "next/server";
import { ObtenerProductosBusqueda, ObtenerCantidadDeResultados } from '@/app/api/queries';
import { json } from "stream/consumers";

export async function GET(request: Request) {
    const titulo = request.headers.get("titulo");
    const categorias = JSON.parse(request.headers.get("categorias") ?? "[]") as string[];
    const apiKey = request.headers.get("seller_api_key");
    const pagina = request.headers.get("pagina");
    const cantidadPorPagina = request.headers.get("cantidad_pagina");

    if (!titulo) {
        return NextResponse.json({ error: "No hay titulo en el request", status: 400 });
    }

    if (!pagina) {
        return NextResponse.json({ error: "No se especifica pagina", status: 400 });
    }

    if (!cantidadPorPagina) {
        return NextResponse.json({ error: "No se especifica cantidad por pagina", status: 400 });
    }

    if (!apiKey) {
        return NextResponse.json({ error: "Unauthorized", status: 401 });
    }


    //if (apiKey !== "sas") {
    //    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //}

    console.log(titulo);
    console.log(categorias);
    console.log(apiKey);

    const productos = await ObtenerProductosBusqueda(titulo, categorias.map(c => c.toLowerCase()), Number(pagina), Number(cantidadPorPagina));
    const cantidadDeProductos = await ObtenerCantidadDeResultados(titulo, categorias.map(c => c.toLowerCase()));

    console.log(`productos: ${JSON.stringify(productos)}`);

    return NextResponse.json({ items: productos, total: cantidadDeProductos });
}