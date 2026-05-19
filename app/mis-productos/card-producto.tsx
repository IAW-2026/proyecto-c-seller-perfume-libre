'use client'

import { Producto } from '@/lib/db/queries/mis-productos';
import Image from 'next/image';
import "./mis-productos.css";

interface Props {
    producto: Producto;
}

function editarProducto(id: number) {
    console.log(`editar ${id}`);
}

export default function CardProducto({ producto }: Props) {
    return (
        <div className="card-producto"> 
            <div className="card-producto-contenedor-imagen">
                <Image
                    src={producto.imagen}
                    alt={producto.titulo}
                    fill
                    className="card-producto-imagen"
                    sizes="(max-width: 200px) 100vw, (max-width: 200px) 50vw"
                    loading="eager">
                </Image>
            </div>

            <h2 className="card-producto-titulo">{producto.titulo}</h2>

            <div className="card-producto-texto">

                <p>Precio: ${producto.precio}</p>

                <p>Stock: {producto.stock}</p>

            </div>

            <button
                className="card-producto-editar"
                onClick={ () => editarProducto(producto.id) }
            >
                Editar
            </button>
        </div>
    );
}