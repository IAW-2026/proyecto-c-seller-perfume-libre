'use client'

import { Producto } from '@/lib/db/db';
import Image from 'next/image';
import "./mis-productos.css";

interface Props {
    producto: Producto;
    onEditar: (producto: Producto) => void;
}

export default function CardProducto({ producto, onEditar }: Props) {
    return (
        <div className="card-producto"> 
            <div className="card-producto-contenedor-imagen">
                <Image
                    src={producto.imagen }
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
                className="card-producto-boton"  
                onClick={() => onEditar(producto)}
            >
                Editar
            </button>
        </div>
    );
}