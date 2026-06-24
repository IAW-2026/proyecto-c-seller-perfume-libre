'use client'

import './resenas.css'
import ResenasVendedor from './resenas-vendedor';
import ResenasProductos from './resenas-productos';
import { ResenaProducto, ResenaVendedor } from '../../lib/db/actions';
import { Producto } from '../../lib/db/schemes';

interface Props {
    resenasVendedorInicial: ResenaVendedor[];
    totalPagesVendedor: number;
    puntajePromedioVendedor: number;

    productos: Producto[];
}

export default function Resenas({ puntajePromedioVendedor, resenasVendedorInicial, totalPagesVendedor, productos} : Props) {
    return (
        <div className = "div_principal">
            <ResenasVendedor resenasVendedorInicial={resenasVendedorInicial} puntajePromedio={puntajePromedioVendedor} totalPages={totalPagesVendedor} />
            <ResenasProductos productos={productos} />
        </div>
    )
}