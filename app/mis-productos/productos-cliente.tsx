"use client";

import { useState } from "react";
import CardProducto from "./card-producto";
import './mis-productos.css';
import { Producto, SubOrden, Domicilio, ProductosPorOrden} from '@/lib/db/db';
import { useAppContext } from '@/app/appContext';
import ModalEditar from './modal-editar';
import ModalPublicar from './modal-publicar';
import ModalOrdenes from './modal-ordenes';
import ModalDomicilio from './modal-domicilio';

interface Props {
    productos: Producto[];
    productosCategorias: Record<number, string[]>;
    forzarIngresarDireccion: boolean;
    domicilio: Domicilio;
    productosPorOrden: ProductosPorOrden[];
}

export default function ProductosCliente({ productos, productosCategorias, forzarIngresarDireccion, domicilio, productosPorOrden }: Props) {

    const { modalCrearAbierto, modalOrdenesAbierto, modalDomicilioAbierto } = useAppContext();
    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

    return (
        <>
            <div className="productosGrid">

                {productos.map((producto) => (

                    <CardProducto
                        key={producto.producto_id}
                        producto={producto}
                        editar={() => { setProductoEditando(producto); } }
                    />

                ))}

            </div>

            {productoEditando && (

                <ModalEditar
                    producto={productoEditando}
                    cerrar={() => setProductoEditando(null)}
                    categoriasDeProducto={productosCategorias[productoEditando.producto_id]}
                />

            )}

            {modalCrearAbierto && (
                <ModalPublicar />
            )}

            {modalOrdenesAbierto && (
                <ModalOrdenes
                    productosPorOrden={productosPorOrden}
                />
            )}

            {(modalDomicilioAbierto || forzarIngresarDireccion) && (
                <ModalDomicilio
                    forzarIngresarDireccion={forzarIngresarDireccion}
                    domicilio={domicilio}
                />
            )}
        </>
    );
}