'use client'

import './resenas.css'
import ResenasVendedor from './resenas-vendedor';
import ResenasProductos from './resenas-productos';

interface Props {
    resenasVendedor: { resena: string, puntaje: number }[];
    resenasProductos: { producto: string, resena: string, puntaje: number }[];
}

export default function Resenas({ resenasProductos, resenasVendedor } : Props) {
    return (
        <div className = "div_principal">
            <ResenasVendedor resenasVendedor={resenasVendedor }/>
            <ResenasProductos resenasProductos={resenasProductos} />
        </div>
    )
}