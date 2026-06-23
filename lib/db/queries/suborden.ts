import { pool } from './connect'
import { SubOrden, EstadoSubOrden } from '../schemes'

export async function ObtenerSubOrdenesQuery(vendedor_id: string) : Promise<SubOrden[]> {
    const result = await pool.query<SubOrden>(`
        SELECT * FROM suborden
        WHERE vendedor_id=$1`,
    [vendedor_id]
    );

    return result.rows;
}

export async function OrdenListaParaRetirarQuery(orden_id: number) {
    const estado: EstadoSubOrden = 'preparado';
    await pool.query(`
        UPDATE suborden
        SET estado=$1
        WHERE orden_id = $2`,
    [estado, orden_id]
    );
}

export async function OrdenRetiradaQuery(suborden_id: number) {
    const estado: EstadoSubOrden = 'retirado';
    await pool.query(`
        UPDATE suborden
        SET estado=$1
        WHERE suborden_id = $2`,
        [estado, suborden_id]
    );
}

export async function CrearSubOrdenQuery(vendedor_id: string, producto_id: number, tracking_id: number, orden_id: number, cantidad: number, precio: number, estado: EstadoSubOrden) : Promise<SubOrden> {
    const result = await pool.query(`
        INSERT INTO suborden (vendedor_id, producto_id, tracking_id, orden_id, cantidad, precio, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
    [vendedor_id, producto_id, tracking_id, orden_id, cantidad, precio, estado]
    );

    return result.rows[0];
}

export async function ObtenerOrdenesEnPreparacionQuery(vendedor_id: string) {
    const estado: EstadoSubOrden = 'en_preparacion';

    const result = await pool.query<SubOrden>(`
        SELECT * from suborden
        WHERE vendedor_id = $1 AND estado = $2`, 
        [vendedor_id, estado]
    );

    return result.rows;
}