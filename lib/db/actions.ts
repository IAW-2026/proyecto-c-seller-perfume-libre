'use server'

import { revalidatePath } from 'next/cache';
import { EditarProductoQuery, ObtenerMisProductosQuery } from './queries/productos';

export async function EditarProducto(id: number, titulo: string, precio: number, agregarStock: number) {
    console.log("editar producto");
    EditarProductoQuery(id, titulo, precio, agregarStock);
    revalidatePath("/mis-productos");
}

export async function ObtenerMisProductos(userId: string) {
    return ObtenerMisProductosQuery(userId);
}