'use client'

import "./resenas";

import { useState } from 'react';
import CardResenaProducto from './card-resena-producto';
import { ObtenerResenasProducto, ResenaProducto } from "../../lib/db/actions";
import { Producto } from "../../lib/db/schemes";
import Pagination from "../pagination";
import { useAppContext } from "../appContext";

interface Props {
    productos: Producto[];
}

const ITEMS_PER_PAGE = 5;

export default function ResenasProductos({ productos }: Props) {

    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [resenas, setResenas] = useState<ResenaProducto[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);

    const { abrirModalError } = useAppContext();

    const handleProductoClick = async (producto: Producto) => {
        setLoading(true);
        setCurrentPage(1);

        try {
            const result = await ObtenerResenasProducto(producto.producto_id, 1);

            if (result.success && result.data) {
                setResenas(result.data.resenas);
                setProductoSeleccionado(producto);
                setTotalPages(result.data.pagination.totalPages);
            }
        } catch (error) {
            abrirModalError("Error al obtener reseñas del producto");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = async (page: number) => {
        setLoading(true);

        try {
            const result = await ObtenerResenasProducto(productoSeleccionado!.producto_id, page);

            if (result.success && result.data) {
                setResenas(result.data.resenas);
                setCurrentPage(page);
            }
        } catch (error) {
            abrirModalError("Error al cambiar página");
        } finally {
            setLoading(false);
        }
    };

    const handleVolver = () => {
        setProductoSeleccionado(null);
        setCurrentPage(1);
        setResenas([]);
    };

    if (productos.length === 0) {
        return (
            <div className="resena_fondo">
                <p className="titulo_resena">Reseñas Productos</p>
                <div className="div_resena">
                    No tienes productos todavia.
                </div>
            </div>
        );
    }

    if (!productoSeleccionado) {
        return (
            <div className="resena_fondo">
                <p className="titulo_resena">Reseñas Productos</p>
                <div className="productos_botones_container">
                    {productos.map((producto) => (
                        <button
                            key={producto.producto_id}
                            onClick={() => { if (!loading) handleProductoClick(producto) }}
                            className="producto_resena_boton"
                            style={{ backgroundColor: loading ? "gray" : "var(--color-slate-500)", cursor:loading?'not-allowed': 'default' }}
                        >
                            {`Ver Reseñas de: ${producto.titulo} | ${producto.producto_id}`}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="resena_fondo">
            <div className="resena_header">
                <button
                    onClick={handleVolver}
                    className="resena_boton_volver"
                    disabled={loading}
                >
                    ← Volver
                </button>
                <p className="titulo_resena">{`Reseñas de: ${productoSeleccionado.titulo}`}</p>
            </div>

            {resenas.length === 0 ? (
                <div className="div_resena">
                    No se encontraron reseñas para este producto.
                </div>
            ) : (
                <>
                    {resenas.map((resena, index) => (
                        <CardResenaProducto
                            key={index}
                            producto={resena.producto}
                            puntaje={resena.puntaje}
                            resena={resena.resena}
                        />
                    ))}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            isLoading={loading}
                        />
                    )}
                </>
            )}
        </div>
    );
}