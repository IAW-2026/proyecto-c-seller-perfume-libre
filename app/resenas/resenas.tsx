'use client'

import './resenas.css'
import ResenasVendedor from './resenas-vendedor';
import ResenasProductos from './resenas-productos';
import { ResenaProducto, ResenaVendedor, Resenas } from '../../lib/db/actions';

interface Props {
    resenas: Resenas;
}

export default function Resenas({ resenas } : Props) {
    return (
        <div className = "div_principal">
            <ResenasVendedor resenasVendedor={resenas.vendedor} puntajeTotalVendedor={resenas.puntajeTotalVendedor} />
            <ResenasProductos resenasProductos={resenas.producto} />
        </div>
    )
}