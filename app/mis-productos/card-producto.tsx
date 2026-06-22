'use client'

import { Producto, ElminarProducto } from '@/lib/db/db';
import Image from 'next/image';
import "./mis-productos.css";
import { useState } from 'react';

interface Props {
    producto: Producto;
    editar: (producto: Producto) => void;
}

export default function CardProducto({ producto, editar }: Props) {

    const [error, setError] = useState<string | null>(null);

    async function elminarProducto() {
        const result = await ElminarProducto(producto.producto_id);

        if ( ! result.success) {
            setError(result.error!.description);
        }
    }

    return (
        <>
            {error && (
                <div style={{zIndex:"10"}} className="modalFondo">

                    <div className="modal">

                        <p style={{ textAlign: "center" }}>{`${error}`}</p>

                        <button
                            className="modalBoton"
                            onClick={() => { setError(null); }}
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

            <div className={producto.estado === "activo" ? "card-producto" : "card-producto-pausado"}>
                {producto.estado === "pausado" && (
                    <p style={{ color: 'darkred', textAlign: "center" }}>Producto Pausado</p>
                )}
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

                <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>

                    <button
                        className="card-producto-boton"
                        onClick={() => editar(producto)}
                    >
                        Editar
                    </button>

                    <button
                        className="card-producto-boton"
                        onClick={async () => await elminarProducto()}
                    >
                        Borrar
                    </button>

                </div>

            </div>

        </>
    );
}