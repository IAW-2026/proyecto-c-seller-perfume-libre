import { pool } from './connect'

import {Categoria } from '../schemes'

export async function PublicarProductoCategoriasQuery(producto_id: number, categorias: string[]) {
    for (const categoria of categorias) {
        await pool.query(`
            INSERT INTO categoria (producto_id, nombre)
            VALUES ($1, $2)`,
        [producto_id, categoria]
        );
    }
}

export async function ObtenerCategoriasDeProductosQuery(productosId: number[]) {

    const result = await pool.query<Categoria>(`
        SELECT * FROM categoria
        WHERE producto_id = ANY($1)
        ORDER BY array_position(
            $1, producto_id
        )`,
        [productosId]
    );

    const categoriasProductos: Record<number, string[]> = {};

    for (const producto_id of productosId) {
        categoriasProductos[producto_id] = [];
    }

    for (const categoria of result.rows) {
        if (!categoriasProductos[categoria.producto_id]) {
            categoriasProductos[categoria.producto_id] = [];
        }

        categoriasProductos[categoria.producto_id].push(categoria.nombre);
    }

    return categoriasProductos;
}

export async function EditarCategoriasQuery(producto_id: number, categorias: string[]) {
    console.log(`editar: ${producto_id} | ${categorias}`);
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        await client.query(`
            DELETE FROM categoria
            WHERE producto_id = $1`,
        [producto_id]
        );

        for (const categoria of categorias) {
            await client.query(`
                INSERT INTO categoria (producto_id, nombre)
                VALUES ($1, $2)`,
            [producto_id, categoria]
            );
        }

        await client.query("COMMIT");
    }
    catch (error) {

        await client.query("ROLLBACK");

        console.log(error);

        throw error;
    }
    finally {
        client.release();
    }
}