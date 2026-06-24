'use client'

import "./resenas";

import CardResenaProducto from './card-resena-producto';
import { ResenaProducto } from "../../lib/db/actions";

interface Props {
    resenasProductos: ResenaProducto[];
}

export default function ResenasProductos({ resenasProductos }: Props) {

    if (resenasProductos.length === 0) {
        return (
            <div className="resena_fondo">
                <p className="titulo_resena">Reseñas Productos</p>
                    <div className="div_resena">
                        No se encontraron reseñas.
                    </div>
            </div>
        );
    }

    return (
        <div className="resena_fondo">
        <p className="titulo_resena">Reseñas Productos</p>
            {resenasProductos.map((e, index) => (
                <CardResenaProducto producto={e.producto} puntaje={e.puntaje} resena={e.resena} key={index} />
            ))}
        </div>
    )
}