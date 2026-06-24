'use client'

import './resenas';

import { useState } from 'react';
import CardResenasVendedor from './card-resena-vendedor';
import { ObtenerResenas, ObtenerResenasVendedor, Resenas } from '../../lib/db/actions';
import { ResenaVendedor } from '../../lib/db/actions';
import Pagination from '../pagination';
import { useAppContext } from '../appContext';

interface Props {
    resenasVendedorInicial  : ResenaVendedor[];
    totalPages: number;
    puntajePromedio: number;
}

export default function ResenasProductos({ resenasVendedorInicial, totalPages, puntajePromedio }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [resenasVendedor, setResenas] = useState(resenasVendedorInicial);
    const [loading, setLoading] = useState(false);

    const { abrirModalError } = useAppContext();

    if (!resenasVendedor)
        return;

    const handlePageChange = async (page: number) => {
        setLoading(true);
        try {
            const result = await ObtenerResenasVendedor(page);

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

    if (resenasVendedor.length === 0 && currentPage === 1) {
        return (
            <div className="resena_fondo">
                <p className="titulo_resena">Reseñas Vendedor</p>
                <div className="div_resena">
                    No se encontraron reseñas.
                </div>
            </div>
        )
    }

    return (
        <div className="resena_fondo">
            <p className="titulo_resena">Reseñas Vendedor</p>
            <p className="puntaje_resena">{`Puntaje promedio: ${puntajePromedio}`}</p>

            {resenasVendedor.map((resena, index) => (
                <CardResenasVendedor puntaje={resena.puntaje} resena={resena.resena} key={index} />
            ))}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                />
            )}
        </div>
    )
}