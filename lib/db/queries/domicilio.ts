import { pool } from "./connect"

import { Domicilio } from '../schemes';

export async function CrearDomicilioQuery(calle: string, ciudad: string, provincia: string, codigo_postal: number) {
    const result = await pool.query(`
        INSERT INTO domicilio (calle, ciudad, provincia, codigo_postal)
        VALUES ($1, $2, $3, $4)
        RETURNING domicilio_id`,
        [calle, ciudad, provincia, codigo_postal]
    );

    return result.rows[0].domicilio_id;
}

export async function ActualizarDomicilioQuery(domicilio: Domicilio) {
    await pool.query(`
        UPDATE domicilio
        SET calle=$1, ciudad=$2, provincia=$3, codigo_postal=$4
        WHERE domicilio_id = $5`,
    [domicilio.calle, domicilio.ciudad, domicilio.provincia, domicilio.codigo_postal, domicilio.domicilio_id]
    );
}

export async function ObtenerDomicilioQuery(domicilio_id: number) : Promise<Domicilio | undefined> {
    const result = await pool.query<Domicilio>(`
        SELECT domicilio_id, calle, ciudad, provincia, codigo_postal FROM domicilio
        WHERE domicilio_id=$1
        LIMIT 1`,
    [domicilio_id]
    );

    return result.rows[0];
}