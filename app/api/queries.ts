import { pool } from '@/lib/db/queries/connect';
import { Producto, EstadoProducto, EstadoSubOrden, SubOrden, Vendedor } from '@/lib/db/schemes';

export async function ObtenerProductosBusqueda(titulo: string | null, categorias: string[], pagina : number, cantidadPorPagina: number): Promise<Producto[]> {
    const estado: EstadoProducto = 'activo'; 

    const offset = (pagina - 1) * cantidadPorPagina;

    if (titulo === null) {

        const result = await pool.query<Producto>(`
        SELECT DISTINCT p.*
        FROM producto p 
        LEFT JOIN categoria c
        ON c.producto_id = p.producto_id
        WHERE p.estado = $2
        AND ( cardinality($1::text[]) = 0 OR LOWER(c.nombre) = ANY($1) )
        LIMIT $3
        OFFSET $4`,
        [categorias, estado, cantidadPorPagina, offset]
        );

        return result.rows;

    } else {

        const result = await pool.query<Producto>(`
        SELECT DISTINCT p.*
        FROM producto p 
        LEFT JOIN categoria c
        ON c.producto_id = p.producto_id
        WHERE p.titulo ILIKE '%' || $1 || '%'
        AND p.estado = $3
        AND ( cardinality($2::text[]) = 0 OR LOWER(c.nombre) = ANY($2) )
        LIMIT $4
        OFFSET $5`,
        [titulo, categorias, estado, cantidadPorPagina, offset]
        );

        return result.rows;
    }
}

export async function ObtenerCantidadDeResultados(titulo: string | null, categorias: string[]) {

    const estado: EstadoProducto = 'activo';

    if (titulo === null) {

        const result = await pool.query(`
        SELECT COUNT (DISTINCT p.producto_id) AS total
        FROM producto p 
        LEFT JOIN categoria c
        ON c.producto_id = p.producto_id
        WHERE p.estado = $2
        AND ( cardinality($1::text[]) = 0 OR LOWER(c.nombre) = ANY($1) )`,
        [categorias, estado]
        );

        return Number(result.rows[0].total);
    } else {

        const result = await pool.query(`
        SELECT COUNT (DISTINCT p.producto_id) AS total
        FROM producto p 
        LEFT JOIN categoria c
        ON c.producto_id = p.producto_id
        WHERE p.titulo ILIKE '%' || $1 || '%'
        AND p.estado = $3
        AND ( cardinality($2::text[]) = 0 OR LOWER(c.nombre) = ANY($2) )`,
        [titulo, categorias, estado]
        );

        return Number(result.rows[0].total);
    }
}

export async function OrdenEnPreparacion(id_vendedor: string, id_orden: number) {
    const estado: EstadoSubOrden = 'en_preparacion';

    await pool.query(`
        UPDATE suborden
        SET estado = $1
        WHERE vendedor_id=$2 AND orden_id = $3`,
    [estado, id_vendedor, id_orden]
    );
}

export async function OrdenRetirada(id_orden: number, tracking_id: number, fecha_retiro: Date) {
    const estado: EstadoSubOrden = 'retirado';

    await pool.query(`
        UPDATE suborden
        SET estado = $1, tracking_id = $2, fecha_retiro=$4
        WHERE orden_id = $3`,
    [estado, tracking_id, id_orden, fecha_retiro]
    );
}

export async function OrdenAprobada(id_orden: number, id_vendedor: string, productos_id: number[]) {
    const estado: EstadoSubOrden = "en_preparacion"; 
    for (const id of productos_id) {
        await pool.query(`
            INSERT INTO suborden (orden_id, vendedor_id, producto_id, cantidad, precio, estado)
            VALUES ($1, $2, $3, $4, $5, $6)`,
        [id_orden, id_vendedor, id, 44, 123, estado]
        );
    }
}

export async function ObtenerSubOrdenes(orden_id: number): Promise<SubOrden[]> {
    const result = await pool.query<SubOrden>(`
        SELECT *
        FROM suborden
        WHERE orden_id = $1`,
    [orden_id]
    );

    return result.rows;
}

export async function ObtenerProducto(producto_id: number) {
    const result = await pool.query<Producto>(`
        SELECT * FROM producto
        WHERE producto_id = $1`,
        [producto_id]
    );

    return result.rows[0];
}

export async function ObtenerVendedor(vendedor_id: string) {

    const result = await pool.query<Vendedor>(`
        SELECT * FROM vendedor
        WHERE clerk_id = $1`,
        [vendedor_id]
    );

    return result.rows[0];
}