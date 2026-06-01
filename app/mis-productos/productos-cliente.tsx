"use client";

import { useState } from "react";
import CardProducto from "./card-producto";
import './mis-productos.css';
import { Producto, SubOrden, Domicilio} from '@/lib/db/db';
import { useAppContext } from '@/app/appContext';
import ModalEditar from './modal-editar';
import ModalPublicar from './modal-publicar';
import ModalOrdenes from './modal-ordenes';
import ModalDomicilio from './modal-domicilio';

interface Props {
    productos: Producto[];
    ordenes: SubOrden[];
    productosOrdenes: Producto[];
    productosCategorias: Record<number, string[]>;
    forzarIngresarDireccion: boolean;
    domicilio: Domicilio;
}

export default function ProductosCliente({ productos, ordenes, productosOrdenes, productosCategorias, forzarIngresarDireccion, domicilio }: Props) {

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
                    ordenes={ordenes}
                    productosOrdenes={productosOrdenes}
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