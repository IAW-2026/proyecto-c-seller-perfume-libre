'use client'

import './modal.css';
import { useAppContext } from '@/app/appContext';
import { SubOrden, Producto, ProductosPorOrden, OrdenAPrepararHecha } from '@/lib/db/db';
import CardOrden from './card-orden';
import { useState } from 'react';

interface Props {
    productosPorOrden: ProductosPorOrden[];
}

export default function ModalOrdenes({ productosPorOrden }: Props) {

    const { cerrarModalOrdenes } = useAppContext();
    const [ordenAbierta, setOrdenAbierta] = useState<number | null>(null);
    const { abrirModalError } = useAppContext();

    async function confirmarOrden() {

        // no deberia pasar pero por si acaso
        if (!ordenAbierta)
            return;

        const result = await OrdenAPrepararHecha(ordenAbierta!);

        if (!result.success) {
            abrirModalError(result.error!.description);
        }
    }

    const hayOrdenes = productosPorOrden.length > 0;

    return (
        <div className="modalFondo">

            <div className="modal">

                <div className="modalScroll">

                    {hayOrdenes && productosPorOrden.map((orden) => {
                        return (
                            <div className="modalSubDivisionColumn" key={orden.orden}>
                                <button
                                    onClick={() => setOrdenAbierta(orden.orden)}
                                    className="botonOrden"
                                >
                                    {`Orden ${orden.orden}`}
                                </button>

                                {ordenAbierta === orden.orden && (
                                    <button className="modalBoton" onClick={async () => confirmarOrden()}>
                                        Confirmar orden hecha
                                    </button>
                                )}

                                {ordenAbierta === orden.orden && (
                                    orden.subOrdenes.map((subOrden) => (
                                        <div key={subOrden.datos.suborden_id} >
                                            <div className="separadorOrden" />
                                            <CardOrden cantidad={subOrden.datos.cantidad} idOrden={subOrden.datos.suborden_id} imagen={subOrden.producto.imagen} titulo={subOrden.producto.titulo} />
                                        </div>
                                    ))
                                )}
                            </div>
                        );
                    })}

                    {!hayOrdenes && (
                        <p>No hay ordenes para mostrar</p>
                    )}

                </div>

                <div className="modalFooter">

                    <div className="modalSubDivisionSpaceArround">
                        <button
                            className="modalBoton"
                            onClick={cerrarModalOrdenes}
                        >
                            Cerrar
                        </button>
                    </div>

                </div>

            </div>

        </div>
        
    )
}