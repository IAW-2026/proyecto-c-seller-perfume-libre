'use client'

import './panel-admin.css'

import { AdminEliminarProducto, Producto, ProductosPorVendedor } from '@/lib/db/db'
import CardProducto from './card-producto';
import { useState } from 'react';
import '../../mis-productos/modal.css';

interface Props {
    productosPorVendedor: ProductosPorVendedor[];
}

interface ProductoSeleccionado {
    producto: Producto;
    cantidad: number;
}

export default function PanelAdmin({ productosPorVendedor }: Props) {

    const [vendedorAbierto, setVendedorAbierto] = useState<number | null>(null);
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState<number | null>(null);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function EnviarOrden() {

        const items = [];
        for (const seleccion of productosSeleccionados) {
            items.push({ producto_id: seleccion.producto.producto_id, cantidad: seleccion.cantidad });
        }

        await fetch("/api/seller/ordenes/pago-aprobado", {
            method: "POST",
            headers: {
                "seller_api_key": "sas",
                "id_orden": `${new Date().getMilliseconds()}`, /* Suficientemente unico para id */
            },
            body: JSON.stringify({
                items,
            }),
        });

        setProductosSeleccionados([]);
    }

    async function EliminarProducto(producto_id: number) {
        const result = await AdminEliminarProducto(producto_id);

        if (!result.success)
            setError(result.error!.description);
    }

    function agregarProducto(index: number) {
        if (vendedorAbierto===null)
            return;

        const producto = productosPorVendedor[vendedorAbierto].productos[index];
        const productoSeleccionado = productosSeleccionados.find((p) => (p.producto.producto_id === producto.producto_id));

        if (producto.stock === 0)
            return;

        if (producto.estado === "borrado" || producto.estado === "pausado")
            return;

        if (!productoSeleccionado) {
            setProductosSeleccionados([...productosSeleccionados, { producto: producto, cantidad: 1 }]);
        }
        else {

            if (producto.stock === productoSeleccionado.cantidad)
                return;

            setProductosSeleccionados(
                productosSeleccionados.map(p =>
                    p.producto.producto_id === producto.producto_id
                        ? { ...p, cantidad: p.cantidad + 1 }
                        : p
                )
            );
        }
    }

    return (
        <>
            {error && (
                <div style={{ zIndex: 10 }} className="modalFondo">

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

            <div className="fondo-admin">
                <div className="fondo-productos-admin">

                    <b style={{ marginBottom: "20px" }}>Eliminar Productos</b>

                    {
                        productosPorVendedor.map(({ vendedor, productos }, index) => (
                            <div key={vendedor.clerk_id} style={{ width: "stretch" }}>

                                <button
                                    className="boton-vendedor"
                                    onClick={() => {
                                        if (vendedorAbierto === null) {
                                            if (vendedorSeleccionado !== index) {
                                                setProductosSeleccionados([]);
                                                setVendedorSeleccionado(index);
                                                setVendedorAbierto(index);
                                            }
                                            else {
                                                setVendedorAbierto(index);
                                            }
                                        }
                                        else {
                                            if (vendedorSeleccionado !== index) {
                                                setProductosSeleccionados([]);
                                                setVendedorSeleccionado(index);
                                            }
                                            setVendedorAbierto(vendedorAbierto === index ? null : index);
                                        }
                                    }}
                                >
                                    {vendedorAbierto === index ? "˅" : "˃"} {vendedor.nombre} {vendedor.apellido}
                                </button>

                                {vendedorAbierto === index && (
                                    <div className="contenedor-cards">
                                        {productos.map((producto, productoIndex) => (
                                            <CardProducto
                                                key={producto.producto_id}
                                                producto={producto}
                                                agregarAOrden={() => agregarProducto(productoIndex)}
                                                eliminarProducto={async () => { await EliminarProducto(producto.producto_id) }}
                                            />
                                        ))}
                                    </div>
                                )}

                            </div>
                        ))
                    }

                </div>

                <div className="orden-admin">

                    <b>Orden a crear</b>

                    {productosSeleccionados.map(({ producto, cantidad }) => (
                        <div className="div-ordenes" key={producto.producto_id}>
                            <p>{`Titulo: ${producto.titulo}`}</p>
                            <p>{`Cantidad: ${cantidad}`}</p>
                        </div>
                    ))}

                    {productosSeleccionados.length > 0 && (
                        <button
                            className="boton"
                            onClick={async () => EnviarOrden()}
                        >
                            Enviar orden
                        </button>
                    )}

                </div>
            </div>
        </>
    );
}