'use client'

import './resenas';

import CardResenasVendedor from './card-resena-vendedor';

interface Props {
    resenasVendedor: { resena: string, puntaje: number }[];
}

export default function ResenasProductos({ resenasVendedor }: Props) {
    return (
        <div className="resena_fondo">
        <p className="titulo_resena">Reseñas Vendedor</p>
            {resenasVendedor.map((e, index) => (
                <CardResenasVendedor puntaje={e.puntaje} resena={e.resena} key={index} />
            ))}
        </div>
    )
} 