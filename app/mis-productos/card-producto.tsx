'use client'

import { Producto, ElminarProducto } from '@/lib/db/db';
import Image from 'next/image';
import "./mis-productos.css";

interface Props {
    producto: Producto;
    editar: (producto: Producto) => void;
}

export default function CardProducto({ producto, editar }: Props) {
    return (
        <div className={producto.estado === "activo" ? "card-producto" : "card-producto-pausado"}> 
            {producto.estado === "pausado" && (
                <p style={{color:'darkred', textAlign:"center"} }>Producto Pausado</p>
            )}
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

            <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>

                <button
                    className="card-producto-boton"  
                    onClick={() => editar(producto)}
                >
                    Editar
                </button>

                <button
                    className="card-producto-boton"
                    onClick={async () => await ElminarProducto(producto.producto_id)}
                >
                    Borrar
                </button>

            </div>

        </div>
    );
}