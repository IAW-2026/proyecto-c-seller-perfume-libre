'use client'

import { Producto, Vendedor } from '@/lib/db/db'
import Image from 'next/image';
import './panel-admin.css'

interface Props {
    producto: Producto;
    agregarAOrden: () => void;
    eliminarProducto: () => void;
}

export default function CardProducto({ producto, agregarAOrden, eliminarProducto }: Props) {
    let color = "green";
    if (producto.estado === "borrado")
        color = "red";
    else if (producto.estado === 'pausado')
        color = "darkgoldenrod";

    return (
        <>
            <div className="card-producto-admin">
                <Image
                    src={producto.imagen}
                    alt="Imagen del producto"
                    width="100"
                    height="100"
                />
                <p>{`Titulo: ${producto.titulo}`}</p>
                <p>{`ID: ${producto.producto_id}`}</p>
                <p style={{ color: color }}>{`Estado: ${producto.estado}`}</p>
                <p>{`Precio: $${producto.precio}`}</p>
                <p>{`Stock: ${producto.stock}`}</p>

                <div className="div-botones">
                    <button
                        className="boton"
                        onClick={() => { eliminarProducto() }}
                    >
                        Eliminar
                    </button>
                    {
                        producto.estado === "activo" && (
                            <button
                                className="boton"
                                onClick={() => { agregarAOrden(); }}
                            >
                                Agregar a orden
                            </button>
                        )
                    }

                </div>

            </div>

            <div className="separador"></div>
        </>
    );
}