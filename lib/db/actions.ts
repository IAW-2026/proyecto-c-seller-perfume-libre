'use server'

import { revalidatePath } from 'next/cache';
import { EditarProductoQuery, ObtenerMisProductosQuery, PublicarProductoQuery } from './queries/productos';

export async function EditarProducto(id: number, titulo: string, precio: number, agregarStock: number) {
    console.log("editar producto");
    EditarProductoQuery(id, titulo, precio, agregarStock);
    revalidatePath("/mis-productos");
}

export async function ObtenerMisProductos(userId: string) {
    return ObtenerMisProductosQuery(userId);
}

export async function PublicarProducto(titulo: string, precio: number, stock: number, imagen: string) {
    console.log(`titulo: ${titulo}, precio: ${precio}, stock: ${stock}, imagen: ${imagen}`);
    PublicarProductoQuery(titulo, precio, stock, imagen);
    revalidatePath("/mis-productos");
}