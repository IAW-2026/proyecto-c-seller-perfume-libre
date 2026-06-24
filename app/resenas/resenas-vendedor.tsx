'use client'

import './resenas';

import CardResenasVendedor from './card-resena-vendedor';
import { ResenaVendedor } from '../../lib/db/actions';

interface Props {
    resenasVendedor: ResenaVendedor[];
    puntajeTotalVendedor: number;
}

export default function ResenasProductos({ resenasVendedor, puntajeTotalVendedor }: Props) {

    if (resenasVendedor.length === 0) {
        return (
            <div className="resena_fondo">
                <p className="titulo_resena">Reseñas Vendedor</p>
                    <div className="div_resena">
                    No se encontraron reseñas.
                    </div>
            </div>
        )
    }

    return (
        <div className="resena_fondo">
        <p className="titulo_resena">Reseñas Vendedor</p>
        <p className="puntaje_resena">{`Puntaje promedio: ${puntajeTotalVendedor}`}</p>
            {resenasVendedor.map((e, index) => (
                <CardResenasVendedor puntaje={e.puntaje} resena={e.resena} key={index} />
            ))}
        </div>
    )
} 