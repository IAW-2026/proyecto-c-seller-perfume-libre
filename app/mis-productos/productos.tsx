"use client";

import { useState } from "react";
import CardProducto from "./card-producto";
import { Producto, OrdenAPreparar, Domicilio } from "@/lib/db/schemes";
import './mis-productos.css';
import { EditarProducto } from '@/lib/db/db';
import { useAppContext } from '@/app/appContext';
import ModalEditar from './modal-editar';
import ModalCrear from './modal-crear';
import ModalOrdenes from './modal-ordenes';
import ModalDomicilio from './modal-domicilio';

interface Props {
    productos: Producto[];
    ordenes: OrdenAPreparar[];
    productosOrdenes: Producto[];
    forzarIngresarDireccion: boolean;
    domicilio: Domicilio;
}

export default function ProductosCliente({ productos, ordenes, productosOrdenes, forzarIngresarDireccion, domicilio }: Props) {

    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState(0);
    const [agregarStock, setAgregarStock] = useState(0);
    const [productoId, setProductoId] = useState(0);

    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

    const { modalCrearAbierto, modalOrdenesAbierto, modalDomicilioAbierto } = useAppContext();

    async function guardarCambios() {
        await EditarProducto(productoId, titulo, precio, agregarStock);

        setProductoEditando(null);
    }

    function abrirModal(producto: Producto) {
        setProductoEditando(producto);
        setTitulo(producto.titulo);
        setPrecio(producto.precio);
        setProductoId(producto.id);
        setAgregarStock(0);
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

                <ModalEditar
                    producto={ productoEditando }
                    cerrar={ () => setProductoEditando(null) }
                    guardar={ guardarCambios }
                    setTitulo={ setTitulo }
                    setPrecio={ setPrecio }
                    setAgregarStock={ setAgregarStock }
                />

            )}

            {modalCrearAbierto && (
               <ModalCrear/>
            )}

            {modalOrdenesAbierto && (
                <ModalOrdenes
                    ordenes={ordenes}
                    productosOrdenes={productosOrdenes}
                />
            )}

            {(modalDomicilioAbierto || forzarIngresarDireccion) && (
                <ModalDomicilio
                    forzarIngresarDireccion={forzarIngresarDireccion}
                    domicilio={domicilio }
                />
            )}
        </>
    );
}