import 'server-only'

import { Producto, EstadoProducto } from '../schemes';
import { pool } from './connect';

export async function ObtenerMisProductosQuery(userId: string, page: number, cantidadPorPagina: number): Promise<{ totalPages: number, productos: Producto[] }> {
    const estadoActivo: EstadoProducto = "activo";
    const estadoPausado: EstadoProducto = "pausado";

    const offset = (page - 1) * cantidadPorPagina;

    const resultProductos = await pool.query<Producto>(`
        SELECT * FROM producto
        WHERE vendedor_id=$1 AND (estado=$2 or estado=$3)
        LIMIT $4
        OFFSET $5`,
    [userId, estadoActivo, estadoPausado, cantidadPorPagina, offset]
    );

    const resultTotal = await pool.query(`
        SELECT COUNT (producto_id) as total
        FROM producto
        WHERE vendedor_id=$1 AND (estado=$2 or estado=$3)`,
        [userId, estadoActivo, estadoPausado]
    );

    const productos = resultProductos.rows;
    const total = Number(resultTotal.rows[0].total);

    return {
        productos: productos,
        totalPages: Math.ceil(total / cantidadPorPagina)
    }

} 

export async function ObtenerTodosMisProductosQuery(userId: string): Promise<Producto[]> {
    const estadoActivo: EstadoProducto = "activo";
    const estadoPausado: EstadoProducto = "pausado";
    const result = await pool.query<Producto>(`
        SELECT * FROM producto
        WHERE vendedor_id=$1 AND (estado=$2 or estado=$3)`,
        [userId, estadoActivo, estadoPausado]
    );

    return result.rows;
} 

export async function ObtenerMisProductosIdsQuery(userId: string): Promise<number[]> {
    const estadoActivo: EstadoProducto = "activo";
    const estadoPausado: EstadoProducto = "pausado";
    const result = await pool.query(`
        SELECT producto_id FROM producto
        WHERE vendedor_id=$1 AND (estado=$2 or estado=$3)`,
        [userId, estadoActivo, estadoPausado]
    );

    return result.rows;
} 

export async function EditarProductoQuery(producto_id: number, vendedor_id: string, titulo: string, descripcion: string, precio: number, stock: number, estado: EstadoProducto, imagen: string) { 
    await pool.query(`
        UPDATE producto
        SET vendedor_id = $2, titulo=$3, descripcion=$4, precio=$5, stock=$6, estado=$7, imagen=$8
        WHERE producto_id=$1`,
    [producto_id, vendedor_id, titulo, descripcion, precio, stock, estado, imagen]
    );
}

export async function PublicarProductoQuery(vendedor_id: string, titulo: string, descripcion: string, precio: number, stock: number, estado: EstadoProducto, imagen: string) : Promise<Producto> {
    const result = await pool.query<Producto>(`
        INSERT INTO producto (vendedor_id, titulo, descripcion, precio, stock, estado,imagen)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
    [vendedor_id, titulo, descripcion, precio, stock, estado, imagen]
    );

    return result.rows[0];
}

export async function ObtenerProductosQuery(productosId: number[]): Promise<Producto[]> {
    const result = await pool.query<Producto>(`
        SELECT p.*
        FROM unnest($1::int[]) AS ids(producto_id)
        JOIN producto p
        ON p.producto_id = ids.producto_id`,
    [productosId]
    );

    return result.rows;
}

export async function ObtenerProductoQuery(producto_id: number): Promise<Producto | undefined> {
    const result = await pool.query<Producto>(`
        SELECT * FROM producto
        WHERE producto_id = $1`,
    [producto_id]
    );

    return result.rows[0];
}

export async function EliminarProductoQuery(producto_id: number) {
    const estado: EstadoProducto = 'borrado';

    await pool.query(`
        UPDATE producto
        SET estado=$2
        WHERE producto_id = $1`,
    [producto_id, estado]
    )
}

export async function ObtenerTodosLosProductosQuery() {
    const result = await pool.query<Producto>(`
        SELECT * FROM producto`
    );

    return result.rows;
}

export async function HardDeleteProductoQuery(producto_id: number) {
    await pool.query(`
        DELETE FROM producto
        WHERE producto_id = $1
`, [producto_id]);
}