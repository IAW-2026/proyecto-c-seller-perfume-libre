import { pool } from './connect';

import { Vendedor } from '../schemes'

export async function CrearVendedorQuery(clerk_id: string, nombre: string, apellido: string, domicilio: number | null) : Promise<Vendedor> {
    const result = await pool.query<Vendedor>(`
        INSERT INTO vendedor (clerk_id, nombre, apellido, domicilio_id)
        VALUES ($1, $2, $3, $4)
        RETURNING * `,
    [clerk_id, nombre, apellido, domicilio]
    );

    return result.rows[0];
}

export async function ObtenerVendedorQuery(clerk_id: string) : Promise<Vendedor | undefined> {
    const result = await pool.query<Vendedor>(
        `SELECT * FROM vendedor WHERE clerk_id=$1 LIMIT 1`, [clerk_id]
    );

    return result.rows[0];
}

export async function AsignarDomicilioQuery(user_id: string, domicilio_id: number) {
    pool.query(`
        UPDATE vendedor
        SET domicilio_id = $1
        WHERE clerk_id = $2` ,
    [domicilio_id, user_id]
    );
}