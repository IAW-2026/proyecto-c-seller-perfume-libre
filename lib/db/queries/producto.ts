import 'server-only'

import { Producto, EstadoProducto } from '../schemes';
import { pool } from './connect';

export async function ObtenerMisProductosQuery(userId: string): Promise<Producto[]> {
    const estadoActivo: EstadoProducto = "activo";
    const estadoPausado: EstadoProducto = "pausado";
    const result = await pool.query<Producto>(`
        SELECT * FROM producto
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