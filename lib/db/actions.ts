'use server'

import { revalidatePath } from 'next/cache';
import { EditarProductoQuery, ObtenerMisProductosQuery, PublicarProductoQuery, ObtenerProductosQuery, ObtenerProductoQuery, EliminarProductoQuery, ObtenerTodosLosProductosQuery, HardDeleteProductoQuery } from './queries/producto';
import { SubOrden, Producto, Domicilio, Vendedor, EstadoProducto, EstadoSubOrden } from './schemes';
import { auth, currentUser } from '@clerk/nextjs/server';
import { AsignarDomicilioQuery, ObtenerVendedorQuery, CrearVendedorQuery, ObtenerTodosLosVendedoresQuery } from './queries/vendedor';
import { CrearDomicilioQuery, ActualizarDomicilioQuery, ObtenerDomicilioQuery } from './queries/domicilio';
import { PublicarProductoCategoriasQuery, ObtenerCategoriasDeProductosQuery, EditarCategoriasQuery } from './queries/categoria';
import { ObtenerSubOrdenesQuery, OrdenListaParaRetirarQuery } from './queries/suborden';
import { EsAdmin } from '../es-admin';

//=======//
// Tipos //
//=======//

export type CodigoError = 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'NOT_FOUND' | 'SERVER_ERROR';

export interface ActionError {
    description: string;
    code: CodigoError;
}

export interface ActionResponse<T> {
    success: boolean;
    data: T | null;
    error: ActionError | null;
}

export type ProductosPorVendedor = {
    vendedor: Vendedor;
    productos: Producto[];
};

//============//
// Respuestas //
//============//

const ResponseUnauthorized: ActionResponse<void> = {
    success: false,
    data: null,
    error: { description: "Acceso invalido", code: 'UNAUTHORIZED' }
};

const ResponseNotFound: ActionResponse<void> = {
    success: false,
    data: null,
    error: { description: "No encontrado", code: 'NOT_FOUND' }
};

const ResponseServerError: ActionResponse<void> = {
    success: false,
    data: null,
    error: { description: "Error interno del servidor", code: 'SERVER_ERROR' }
};

const ResponseValidationError: ActionResponse<void> = {
    success: false,
    data: null,
    error: { description: "Error de validacion", code: 'VALIDATION_ERROR' }
};

const ResponseOk: ActionResponse<void> = {
    success: true,
    data: null,
    error: null
};

//==============//
// Validaciones //
//==============//

async function obtenerUserId() {

    const { userId } = await auth();

    if (!userId)
        return null;

    return userId;
}

function validarNumero(valor: number) {
    return !Number.isNaN(valor);
}

function validarNumeros(valores: number[]) {
    for (const n of valores) {
        if (!validarNumero(n))
            return false;
    }

    return true;
}

function validarRequeridos(parametros: Record<string, string | string[] | number | EstadoProducto | EstadoSubOrden | Domicilio>, nombres: string[]): boolean {
    for (const nombre of nombres) {
        if (parametros[nombre] === null || parametros[nombre] === undefined) {
            console.error("Error en validarRequeridos:", parametros, " / ", nombre, " / ", nombres);
            return false;
        }
    }

    return true;
}

function validarArrayIds(ids: number[]): boolean {
    if (!ids || !Array.isArray(ids)) {
        return false;
    }
    for (const id of ids) {
        if (!validarNumero(id)) {
            return false;
        }
    }

    return true;
}

//=======================//
// Acciones de productos //
//=======================//

export async function PublicarProducto(titulo: string, descripcion: string, precio: number, stock: number, imagen: string, categorias: string[]) {

    if (!validarRequeridos({ titulo, descripcion, precio, stock, imagen, categorias },
        ["titulo", "descripcion", "precio", "stock", "imagen", "categorias"])) {

        return ResponseValidationError;
    }

    if (!validarNumeros([precio, stock])) {
        return ResponseValidationError;
    }

    if (stock <= 0 || precio <= 0)
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId) {
        return ResponseUnauthorized;
    }

    try {

        // TODO: revertir producto si falla categorias
        const producto = await PublicarProductoQuery(userId, titulo, descripcion, precio, stock, 'activo', imagen);
        await PublicarProductoCategoriasQuery(producto.producto_id, categorias);

        revalidatePath("/mis-productos");

        return ResponseOk;
    }
    catch (error) {
        console.error("Error en action PublicarProducto: ", error);

        return ResponseServerError;
    }
}

export async function EditarProducto(producto_id: number, vendedor_id: string, titulo: string, descripcion: string, precio: number, stock: number, imagen: string) {

    // TODO: agregar la posibilidad de editar imagen.

    if (!validarRequeridos({ titulo, descripcion, precio, stock, imagen, vendedor_id },
        ["titulo", "descripcion", "precio", "stock", "imagen", "vendedor_id"])) {

        return ResponseValidationError;
    }

    if (!validarNumeros([producto_id, precio, stock]))
        return ResponseValidationError;

    if (precio <= 0 || stock < 0)
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    const producto = await ObtenerProductoQuery(producto_id);

    if (!producto)
        return ResponseNotFound;

    if (vendedor_id !== producto.vendedor_id)
        return ResponseValidationError;

    const nuevoEstado: EstadoProducto = producto.estado === 'pausado' && stock > 0 ? 'activo' : producto.estado;

    try {
        await EditarProductoQuery(producto_id, vendedor_id, titulo, descripcion, precio, stock, nuevoEstado, imagen);

        revalidatePath("/mis-productos");

        return ResponseOk;
    } catch (error) {
        console.error("Error en action EditarProducto: ", error);

        return ResponseServerError;
    }
}

export async function ElminarProducto(producto_id: number) {

    if (!validarNumero(producto_id))
        return ResponseValidationError;

    const userId = obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        await EliminarProductoQuery(producto_id);

        revalidatePath("/mis-productos");

        return ResponseOk;
    }
    catch (error) {
        console.error("Error en action ElminarProducto: ", error);

        return ResponseServerError;
    }
}

export async function ObtenerMisProductos(): Promise<ActionResponse<void> | ActionResponse<Producto[]>> {

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        const productos = await ObtenerMisProductosQuery(userId);

        return {
            success: true,
            error: null,
            data: productos
        };
    }
    catch (error) {
        console.error("Error en action ObtenerMisProductos: ", error);

        return ResponseServerError;
    }
}

export async function ObtenerProductos(productosId: number[]): Promise<ActionResponse<void> | ActionResponse<Producto[]>> {

    if (!validarArrayIds(productosId))
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        const result = await ObtenerProductosQuery(productosId);

        return {
            success: true,
            error: null,
            data: result
        };
    }
    catch (error) {
        console.error("Error en action ObtenerProductos: ", error);

        return ResponseServerError;
    }
}

//========================//
// Acciones de categorias //
//========================//

export async function ObtenerCategoriasDeProductos(productosId: number[]): Promise<ActionResponse<void> | ActionResponse<Record<number, string[]>>> {

    if (!validarArrayIds(productosId))
        return ResponseValidationError;

    const userId = obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        const result = await ObtenerCategoriasDeProductosQuery(productosId);

        return {
            success: true,
            error: null,
            data: result
        };
    }
    catch (error) {
        console.error("Error en action ObtenerCategoriasDeProductos: ", error);

        return ResponseServerError;
    }
}

export async function EditarCategorias(producto_id: number, categorias: string[]) {

    if (!validarNumero(producto_id))
        return ResponseValidationError;

    if (!categorias || !Array.isArray(categorias) || categorias.length === 0) {
        return ResponseValidationError;
    }

    for (const categoria of categorias) {
        if (typeof categoria !== 'string' || categoria.trim() === '') {
            return ResponseValidationError;
        }
    }

    const userId = obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        await EditarCategoriasQuery(producto_id, categorias);

        revalidatePath("/mis-productos");

        return ResponseOk;
    }
    catch (error) {
        console.error("Error en action EditarCategorias: ", error);

        return ResponseServerError;
    }
}

//=======================//
// Acciones de domicilio //
//=======================//

export async function CrearYAsignarDomicilio(calle: string, ciudad: string, provincia: string, codigo_postal: number) {

    if (!validarRequeridos({ calle, ciudad, provincia, codigo_postal },
        ["calle", "ciudad", "provincia", "codigo_postal"])) {

        return ResponseValidationError;
    }

    if (!validarNumero(codigo_postal))
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        const domicilio_id = await CrearDomicilioQuery(calle, ciudad, provincia, codigo_postal);
        await AsignarDomicilioQuery(userId, domicilio_id);

        revalidatePath("/mis-productos");

        return ResponseOk;
    }
    catch (error) {
        console.error("Error en action CrearYAsignarDomicilio", error);

        return ResponseServerError;
    }
}

export async function ActualizarDomicilio(domicilio: Domicilio) {

    if (!domicilio.calle || !domicilio.ciudad || !domicilio.provincia || !domicilio.codigo_postal) {
        return ResponseValidationError;
    }

    if (!validarNumero(domicilio.codigo_postal))
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        await ActualizarDomicilioQuery(domicilio);

        revalidatePath("/mis-productos");

        return ResponseOk;
    }
    catch (error) {
        console.error("Error en action ActualizarDomicilio: ", error);

        return ResponseServerError;
    }
}

export async function ObtenerDomicilio(domicilio_id: number): Promise<ActionResponse<void> | ActionResponse<Domicilio>> {

    if (!validarNumero(domicilio_id)) 
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId) {
        return ResponseUnauthorized;
    }

    try {
        const domicilio = await ObtenerDomicilioQuery(domicilio_id);

        if (!domicilio) {
            return ResponseNotFound;
        }

        return {
            success: true,
            error: null,
            data: domicilio
        };
    }
    catch (error) {
        console.error("Error en action ObtenerDomicilio: ", error);

        return ResponseServerError;
    }
}

//======================//
// Acciones de vendedor //
//======================//

/**
 * Si no existe vendedor se crea uno con domicilio null.
 */
export async function ObtenerVendedor(): Promise<ActionResponse<void> | ActionResponse<Vendedor>> {

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        let vendedor = await ObtenerVendedorQuery(userId);

        if (!vendedor) {
            const user = await currentUser();
            if (!user?.firstName || !user?.lastName) {
                return {
                    success: false,
                    error: { description: "No se pudo obtener informacion del usuario", code: 'SERVER_ERROR' },
                    data: null
                };
            }

            vendedor = await CrearVendedorQuery(userId, user.firstName, user.lastName, null);
        }

        return {
            success: true,
            data: vendedor,
            error: null
        };

    } catch (error) {
        console.error("Error en action ObtenerVendedor: ", error);

        return ResponseServerError;
    }
}

//=====================//
// Acciones de ordenes //
//=====================//

export async function ObtenerSubOrdenes(): Promise<ActionResponse<void> | ActionResponse<SubOrden[]>> {

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    try {
        const result = await ObtenerSubOrdenesQuery(userId);

        return {
            success: true,
            data: result,
            error: null
        }
    }
    catch (error) {
        console.error("Error en action: ObtenerSubOrdenes", error);

        return ResponseServerError;
    }
}

export async function OrdenAPrepararHecha(suborden_id: number) {

    if (!validarNumero(suborden_id))
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    console.log("llamar a shipping");

    try {
        await OrdenListaParaRetirarQuery(suborden_id);

        revalidatePath("/mis-productos");

        return ResponseOk;
    }
    catch (error) {
        console.error("Error en action OrdenAPrepararHecha: ", error);

        return ResponseServerError;
    }
}

//===================//
// Acciones de admin //
//===================//

export async function AdminProductosPorVendedor(): Promise<ActionResponse<void> | ActionResponse<{ vendedor: Vendedor, productos: Producto[] }[]>> {

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    if (!await EsAdmin())
        return ResponseUnauthorized;

    try {
        const vendedores = await ObtenerTodosLosVendedoresQuery();
        const productos = await ObtenerTodosLosProductosQuery();

        const data = vendedores.map(vendedor => ({
            vendedor,
            productos: productos.filter(p => p.vendedor_id === vendedor.clerk_id)
        }));

        return {
            success: true,
            error: null,
            data: data
        };

    } catch (error) {
        console.error("Error en action AdminProductosPorVendedor:", error);

        return ResponseServerError;
    }
}

export async function AdminEliminarProducto(producto_id: number) {

    if (!validarNumero(producto_id))
        return ResponseValidationError;

    const userId = await obtenerUserId();

    if (!userId)
        return ResponseUnauthorized;

    if (!await EsAdmin())
        return ResponseUnauthorized;

    try {
        await HardDeleteProductoQuery(producto_id);

        revalidatePath("/seller/admin");

        return ResponseOk;

    } catch (error) {
        console.error("Error en action AdminEliminarProducto:", error);

        return ResponseServerError;
    }
}