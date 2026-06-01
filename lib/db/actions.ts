'use server'

import { revalidatePath } from 'next/cache';
import { EditarProductoQuery, ObtenerMisProductosQuery, PublicarProductoQuery, ObtenerProductosQuery, ObtenerProductoQuery, EliminarProductoQuery } from './queries/producto';
import { SubOrden, Producto, Domicilio, Vendedor, EstadoProducto } from './schemes';
import { auth, currentUser } from '@clerk/nextjs/server';
import { AsignarDomicilioQuery, ObtenerVendedorQuery, CrearVendedorQuery } from './queries/vendedor';
import { CrearDomicilioQuery, ActualizarDomicilioQuery, ObtenerDomicilioQuery } from './queries/domicilio';
import { PublicarProductoCategoriasQuery, ObtenerCategoriasDeProductosQuery, EditarCategoriasQuery } from './queries/categoria';
import { ObtenerSubOrdenesQuery, OrdenListaParaRetirarQuery } from './queries/suborden';

export async function EditarProducto(producto_id: number, vendedor_id: string, titulo: string, descripcion: string, precio: number, stock: number, estado: EstadoProducto, imagen: string) {
    if (!producto_id || !vendedor_id || !titulo || !descripcion || !precio || !precio || !stock || !estado || !imagen) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(producto_id) || Number.isNaN(precio) || Number.isNaN(stock)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId)
        throw Error("No se detecto usuario");

    const producto = await ObtenerProductoQuery(producto_id);

    if (!producto)
        return;

    if (vendedor_id !== producto.vendedor_id)
        return;

    if (producto.estado === 'pausado') {
        if (stock > 0) {
            await EditarProductoQuery(producto_id, vendedor_id, titulo, descripcion, precio, stock, "activo", imagen);
        }
        else {
            console.log("sasasd");
            await EditarProductoQuery(producto_id, vendedor_id, titulo, descripcion, precio, 0, "pausado", imagen);
        }
    }
    else {
        await EditarProductoQuery(producto_id, vendedor_id, titulo, descripcion, precio, stock, estado, imagen);
    }

    revalidatePath("/mis-productos");
}

export async function ObtenerMisProductos() {
    const { userId } = await auth();

    if (!userId)
        throw Error("No se detecto usuario");

    try {
        return await ObtenerMisProductosQuery(userId!);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo obtener productos");
    }

}

export async function PublicarProducto(titulo: string, descripcion: string, precio: number, stock: number, estado: EstadoProducto, imagen: string, categorias: string[]) {
    if (!categorias || !titulo || !descripcion || !precio || !precio || !stock || !estado || !imagen) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(precio) || Number.isNaN(stock)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId)
        throw Error("No se detecto usuario");

    try {
        const producto = await PublicarProductoQuery(userId!, titulo, descripcion, precio, stock, estado, imagen);
        await PublicarProductoCategoriasQuery(producto.producto_id, categorias);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo publicar producto");
    }


    revalidatePath("/mis-productos");
}

export async function ObtenerSubOrdenes(): Promise<SubOrden[]> {
    const { userId } = await auth();

    if (!userId)
        throw Error("No se detecto usuario");

    try {
        return ObtenerSubOrdenesQuery(userId!);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo obtener ordenes");
    }

}

export async function OrdenAPrepararHecha(suborden_id: number) {
    if (Number.isNaN(suborden_id) || !suborden_id) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId)
        return;

    console.log("llamar a shipping");

    try {
        await OrdenListaParaRetirarQuery(suborden_id);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo poner orden lista para retirar");
    }


    revalidatePath("/mis-productos");
}

export async function ObtenerProductos(productosId: number[]): Promise<Producto[]> {
    if (!productosId) {
        throw Error("Parametros invalidos");
    }

    for (const id of productosId) {
        if (Number.isNaN(id)) {
            throw Error("Parametros invalidos");
        }
    }

    const { userId } = await auth();

    if (!userId)
        throw Error("No se detecto usuario");

    try {
        return await ObtenerProductosQuery(productosId);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo obtener productos");
    }

}

export async function CrearYAsignarDomicilio(calle: string, ciudad: string, provincia: string, codigo_postal: number) {
    if (!calle || !ciudad || !provincia || !codigo_postal) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(codigo_postal)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        const domicilio_id = await CrearDomicilioQuery(calle, ciudad, provincia, codigo_postal);
        await AsignarDomicilioQuery(userId!, domicilio_id);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo crear domicilio");
    }

    revalidatePath("/mis-productos");
}

export async function ActualizarDomicilio(domicilio: Domicilio) {
    if (!domicilio.calle || !domicilio.ciudad || !domicilio.provincia || !domicilio.codigo_postal) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(domicilio.codigo_postal)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        await ActualizarDomicilioQuery(domicilio);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo actualizar domicilio");
    }

    revalidatePath("/mis-productos");
}

/**
 * Si no existe vendedor se crea uno con domicilio null.
 */
export async function ObtenerVendedor(): Promise<Vendedor> {
    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    let vendedor;
    try {
        vendedor = await ObtenerVendedorQuery(userId!);
    }
    catch (error) {
        console.log(error);
        throw Error("Error al tratar de obtener vendedor");
    }

    const noExiste = vendedor === undefined;

    if (noExiste) {
        const user = await currentUser();
        const nombre = user!.firstName!;
        const apellido = user!.lastName!;

        try {
            vendedor = await CrearVendedorQuery(userId!, nombre, apellido, null);
        }
        catch (error) {
            console.log(error);
            throw Error("Error al crear informacion de vendedor");
        }
    }

    return vendedor!;
}

export async function ObtenerDomicilio(domicilio_id: number) {
    if (!domicilio_id) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(domicilio_id)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        return await ObtenerDomicilioQuery(domicilio_id);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo obtener domicilio");
    }

}

export async function ObtenerCategoriasDeProductos(productosId: number[]) {
    if (!productosId) {
        throw Error("Parametros invalidos");
    }

    for (const id of productosId) {
        if (Number.isNaN(id)) {
            throw Error("Parametros invalidos");
        }
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        return ObtenerCategoriasDeProductosQuery(productosId)
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo obtener categorias");
    }

}

export async function EditarCategorias(producto_id: number, categorias: string[]) {
    if (!producto_id || !categorias) {
        throw Error("Parametros invalidos");
    }
    for (const categoria of categorias) {
        if (!categoria) {
            throw Error("Parametros invalidos");
        }
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        await EditarCategoriasQuery(producto_id, categorias);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo editar categorias");
    }

    revalidatePath("/mis-productos");
}

export async function ObtenerProducto(producto_id: number) {
    if (!producto_id) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(producto_id)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        return await ObtenerProductoQuery(producto_id);
    }
    catch (error) {
        console.log(error);
        throw Error("No se puo obtener el producto");
    }

}

export async function ElminarProducto(producto_id: number) {
    if (!producto_id) {
        throw Error("Parametros invalidos");
    }

    if (Number.isNaN(producto_id)) {
        throw Error("Parametros invalidos");
    }

    const { userId } = await auth();

    if (!userId) {
        throw Error("No se detecta usuario");
    }

    try {
        await EliminarProductoQuery(producto_id);
    }
    catch (error) {
        console.log(error);
        throw Error("No se pudo eliminar prodcuto");
    }


    revalidatePath("/mis-productos");
}