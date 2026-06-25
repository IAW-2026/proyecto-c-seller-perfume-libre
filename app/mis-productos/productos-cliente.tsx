"use client";

import { useState } from "react";
import CardProducto from "./card-producto";
import './mis-productos.css';
import { Producto, SubOrden, Domicilio, ProductosPorOrden, ObtenerMisProductos, ObtenerCategoriasDeProductos} from '@/lib/db/db';
import { useAppContext } from '@/app/appContext';
import ModalEditar from './modal-editar';
import ModalPublicar from './modal-publicar';
import ModalOrdenes from './modal-ordenes';
import ModalDomicilio from './modal-domicilio';
import Pagination from "../pagination";

interface Props {
    productosIniciales: Producto[];
    productosCategoriasIniciales: Record<number, string[]>;
    forzarIngresarDireccion: boolean;
    domicilio: Domicilio;
    productosPorOrden: ProductosPorOrden[];
    cantidadPorPaginaInicial: number;
    totalPages: number;
}

export default function ProductosCliente({ productosIniciales, productosCategoriasIniciales, forzarIngresarDireccion, domicilio, productosPorOrden, cantidadPorPaginaInicial, totalPages }: Props) {

    const { modalCrearAbierto, modalOrdenesAbierto, modalDomicilioAbierto, abrirModalError } = useAppContext();
    const [productoEditando, setProductoEditando] = useState<Producto | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [productos, setProductos] = useState<Producto[]>(productosIniciales);
    const [productosCategorias, setProductosCategorias] = useState<Record<number, string[]>>(productosCategoriasIniciales);
    const [cantidadPorPagina, setCantidadPorPagina] = useState(cantidadPorPaginaInicial);

    const handlePageChange = async (page: number) => {
        setLoading(true);

        console.log(`page: ${page} | cantidadXpag: ${cantidadPorPagina}`);

        const resultProductos = await ObtenerMisProductos(page, cantidadPorPagina);

        if (!resultProductos.success) {
            setLoading(false);
            abrirModalError("Error al obtener datos de productos");
            return;
        }

        const productosCategoriasResult = await ObtenerCategoriasDeProductos(resultProductos.data!.productos.map(p => p.producto_id));

        if (!productosCategoriasResult.success) {
            setLoading(false);
            abrirModalError("Error al obtener datos de categorias");
            return;
        }

        setProductos(resultProductos.data!.productos);
        setCurrentPage(page);
        setProductosCategorias(productosCategoriasResult.data!);

        setLoading(false);
    };

    return (
        <>
            {cantidadPorPagina > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                />
            )}

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