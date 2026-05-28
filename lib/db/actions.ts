'use server'

import { revalidatePath } from 'next/cache';
import { EditarProductoQuery, ObtenerMisProductosQuery, PublicarProductoQuery, ObtenerProductosQuery } from './queries/productos';
import {ObtenerOrdenesAPrepararQuery, OrdenAPrepararHechaQuery} from './queries/ordenes';
import { OrdenAPreparar, Producto, Domicilio, Vendedor } from './schemes';
import { auth, currentUser } from '@clerk/nextjs/server';
import { AsignarDomicilioQuery, ObtenerVendedorQuery, CrearVendedorQuery } from './queries/vendedor';
import { CrearDomicilioQuery, ActualizarDomicilioQuery, ObtenerDomicilioQuery } from './queries/domicilio';

export async function EditarProducto(id: number, titulo: string, precio: number, agregarStock: number) {
    console.log("editar producto");
    await EditarProductoQuery(id, titulo, precio, agregarStock);
    revalidatePath("/mis-productos");
}

export async function ObtenerMisProductos(userId: string) {
    return await ObtenerMisProductosQuery(userId);
}

export async function PublicarProducto(titulo: string, precio: number, stock: number, imagen: string) {
    console.log(`titulo: ${titulo}, precio: ${precio}, stock: ${stock}, imagen: ${imagen}`);
    await PublicarProductoQuery(titulo, precio, stock, imagen);
    revalidatePath("/mis-productos");
}

export async function ObtenerOrdenesAPreparar(userId: string): Promise<OrdenAPreparar[]> {
    return await ObtenerOrdenesAPrepararQuery(userId);
}

export async function OrdenAPrepararHecha(ordenAPrepararId: number) {
    console.log("llamar a shipping");
    await OrdenAPrepararHechaQuery(ordenAPrepararId);
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