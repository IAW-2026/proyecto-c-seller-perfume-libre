'use client'

import "./resenas";

import CardResenaProducto from './card-resena-producto';

interface Props {
    resenasProductos: { producto: string, resena: string, puntaje: number }[];
}

export default function ResenasProductos({ resenasProductos }: Props) {
    return (
        <div className="resena_fondo">
        <p className="titulo_resena">Reseñas Productos</p>
            {resenasProductos.map((e, index) => (
                <CardResenaProducto producto={e.producto} puntaje={e.puntaje} resena={e.resena} key={index} />
            ))}
        </div>
    )
}