'use server'

import { revalidatePath } from 'next/cache';
import { EditarProductoQuery, ObtenerMisProductosQuery, PublicarProductoQuery, ObtenerProductosQuery } from './queries/producto';
import { SubOrden, Producto, Domicilio, Vendedor, EstadoProducto } from './schemes';
import { auth, currentUser } from '@clerk/nextjs/server';
import { AsignarDomicilioQuery, ObtenerVendedorQuery, CrearVendedorQuery } from './queries/vendedor';
import { CrearDomicilioQuery, ActualizarDomicilioQuery, ObtenerDomicilioQuery } from './queries/domicilio';
import { PublicarProductoCategoriasQuery, ObtenerCategoriasDeProductosQuery, EditarCategoriasQuery } from './queries/categoria';
import { ObtenerSubOrdenesQuery, OrdenListaParaRetirarQuery } from './queries/suborden';

export async function EditarProducto(producto_id: number, vendedor_id: string, titulo: string, descripcion: string, precio: number, stock: number, estado: EstadoProducto, imagen: string) {
    await EditarProductoQuery(producto_id, vendedor_id, titulo, descripcion, precio, stock, estado, imagen);
    revalidatePath("/mis-productos");
}

export async function ObtenerMisProductos() {
    const { userId } = await auth();
    return await ObtenerMisProductosQuery(userId!);
}

export async function PublicarProducto(titulo: string, descripcion: string, precio: number, stock: number, estado: EstadoProducto, imagen: string, categorias: string[]) {
    const { userId } = await auth();
    const producto = await PublicarProductoQuery(userId!, titulo, descripcion, precio, stock, estado, imagen);
    await PublicarProductoCategoriasQuery(producto.producto_id, categorias);
    revalidatePath("/mis-productos");
}

export async function ObtenerSubOrdenes(): Promise<SubOrden[]> {
    const { userId } = await auth();
    return ObtenerSubOrdenesQuery(userId!);
}

export async function OrdenAPrepararHecha(suborden_id: number) {
    console.log("llamar a shipping");
    await OrdenListaParaRetirarQuery(suborden_id);
    revalidatePath("/mis-productos");
}

export async function ObtenerProductos(productosId: number[]): Promise<Producto[]> {
    return await ObtenerProductosQuery(productosId);
}

export async function CrearYAsignarDomicilio(calle: string, ciudad:string, provincia:string, codigo_postal: number) {
    const { userId } = await auth();

    if (!userId) {
        console.error("No hay usuario")
        return;
    }

    const domicilio_id = await CrearDomicilioQuery(calle, ciudad, provincia, codigo_postal);

    await AsignarDomicilioQuery(userId!, domicilio_id);

    revalidatePath("/mis-productos");
}

export async function ActualizarDomicilio(domicilio: Domicilio) {
    await ActualizarDomicilioQuery(domicilio);

    revalidatePath("/mis-productos");
}

/**
 * Si no existe vendedor se crea uno con domicilio null.
 */
export async function ObtenerVendedor() : Promise<Vendedor> {
    const { userId } = await auth();

    let vendedor = await ObtenerVendedorQuery(userId!);

    const noExiste = vendedor === undefined;

    if (noExiste) {
        const user = await currentUser();
        const nombre = user!.firstName!;
        const apellido = user!.lastName!;

        vendedor = await CrearVendedorQuery(userId!, nombre, apellido, null);
    }

    return vendedor!;
}

export async function ObtenerDomicilio(domicilio_id: number) {
    return await ObtenerDomicilioQuery(domicilio_id);
}

export async function ObtenerCategoriasDeProductos(productosId: number[]) {
    return ObtenerCategoriasDeProductosQuery(productosId)
}

export async function EditarCategorias(producto_id: number, categorias: string[]) {
    await EditarCategoriasQuery(producto_id, categorias);
    revalidatePath("/mis-productos");
}