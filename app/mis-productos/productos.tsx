"use client";

import { useState } from "react";
import CardProducto from "./card-producto";
import { Producto, SubOrden, Domicilio } from "@/lib/db/schemes";
import './mis-productos.css';
import { EditarProducto,  EditarCategorias } from '@/lib/db/db';
import { useAppContext } from '@/app/appContext';
import ModalEditar from './modal-editar';
import ModalCrear from './modal-crear';
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

    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState(0);
    const [agregarStock, setAgregarStock] = useState(0);
    const [categorias, setCategorias] = useState<string[]>([]);

    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

    const { modalCrearAbierto, modalOrdenesAbierto, modalDomicilioAbierto } = useAppContext();

    function categoriasIguales(a: string[], b: string[]) {
        if (a.length !== b.length) {
            return false;
        }

        return a.every((valor, index) => valor === b[index]);
    }

    async function guardarCambios() {
        await EditarProducto(productoEditando!.producto_id, productoEditando!.vendedor_id, titulo, descripcion, precio, productoEditando!.stock + agregarStock, productoEditando!.estado, productoEditando!.imagen);

        if (!categoriasIguales(productosCategorias[productoEditando!.producto_id], categorias)) {
            await EditarCategorias(productoEditando!.producto_id, categorias);
        }

        setProductoEditando(null);
    }

    function abrirModal(producto: Producto) {
        setProductoEditando(producto);
        setTitulo(producto.titulo);
        setDescripcion(producto.descripcion);
        setPrecio(producto.precio);
        setCategorias(productosCategorias[producto.producto_id]);
        setAgregarStock(0);
    }

    return (
        <>
            <div className="productosGrid">

                {productos.map((producto) => (

                    <CardProducto
                        key={producto.producto_id}
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
                    setTitulo={setTitulo}
                    setDescripcion={setDescripcion}
                    categorias={categorias}
                    setCategorias={setCategorias}
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