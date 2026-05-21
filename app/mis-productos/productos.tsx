"use client";

import { useState } from "react";
import CardProducto from "./card-producto";
import { Producto } from "@/lib/db/schemes";
import './mis-productos.css';
import Image from 'next/image';
import { EditarProducto } from '@/lib/db/db';

interface Props {
    productos: Producto[];
}

export default function ProductosCliente({ productos }: Props) {

    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState(0);
    const [agregarStock, setAgregarStockk] = useState(0);
    const [productoId, setProductoId] = useState(0);
    const [stock, setStock] = useState(0);

    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

    const [productoCreando, setProductoCreando] = useState<boolean>(false);

    async function guardarCambios() {
        await EditarProducto(productoId, titulo, precio, agregarStock);

        setProductoEditando(null);
    }

    function abrirModal(producto: Producto) {
        setProductoEditando(producto);
        setTitulo(producto.titulo);
        setPrecio(producto.precio);
        setProductoId(producto.id);
    }

    return (
        <>
            <div className="productosGrid">

                {productos.map((producto) => (

                    <CardProducto
                        key={producto.id}
                        producto={producto}
                        onEditar={abrirModal}
                    />

                ))}

            </div>

            {productoEditando && (

                <div className="modal-fondo">

                    <div className="modal">

                        <div className="modal-div-superior">

                            <div className="modal-contenedor-imagen">
                                <Image
                                    src={productoEditando.imagen}
                                    alt={productoEditando.titulo}
                                    fill
                                    className="card-producto-imagen"
                                    sizes="(max-width: 100px) 100vw, (max-width: 50px) 100vw"
                                    loading="eager">
                                </Image>
                            </div>

                            <button className="modal-boton"
                                onClick={() =>
                                    setProductoEditando(null)
                                }
                            >
                                Editar Imagen
                            </button>

                        </div>

                        <div className="modal-div-medio">

                            <p>Titulo</p>

                            <input
                                className="modal-input-texto"
                                type="text"
                                defaultValue={productoEditando.titulo}
                                onChange={(e) =>
                                    setTitulo(e.target.value)
                                }
                            />

                            <p>Precio</p>

                            <input
                                className="modal-input-texto"
                                type="number"
                                defaultValue={productoEditando.precio}
                                onChange={(e) =>
                                    setPrecio(Number(e.target.value))
                                }
                            />

                            <p>Agregar Stock</p>

                            <input
                                className="modal-input-texto"
                                type="number"
                                step="1"
                                defaultValue="0"
                                min="0"
                                onChange={(e) =>
                                    setAgregarStockk(Number(e.target.value))
                                }
                                onKeyDown={(e) => {

                                    if (
                                        e.key === "e" ||
                                        e.key === "E" ||
                                        e.key === "+" ||
                                        e.key === "-"
                                    ) {
                                        e.preventDefault();
                                    }

                                }}
                            />

                        </div>

                        <div className="modal-div-inferior">

                            <button className="modal-boton"
                                onClick={() => {
                                    guardarCambios();
                                }}
                            >
                                Guardar
                            </button>

                            <button className="modal-boton"
                                onClick={() =>
                                    setProductoEditando(null)
                                }
                            >
                                Cancelar
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}