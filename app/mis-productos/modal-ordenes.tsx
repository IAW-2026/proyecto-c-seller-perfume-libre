'use client'

import './modal.css';
import { useAppContext } from '@/app/appContext';
import { SubOrden, Producto } from '@/lib/db/db';
import CardOrden from './card-orden';

interface Props {
    ordenes: SubOrden[];
    productosOrdenes: Producto[];
}

export default function ModalOrdenes({ ordenes, productosOrdenes }: Props) {

    const { cerrarModalOrdenes } = useAppContext();

    return (
        <div className="modalFondo">

            <div className="modal">

                <div className="modalScroll">

                    {ordenes.filter((suborden) => suborden.estado === "en_preparacion").map((orden, index) => (

                        <CardOrden
                            titulo={productosOrdenes[index].titulo}
                            cantidad={orden.cantidad}
                            idOrden={orden.suborden_id}
                            imagen={productosOrdenes[index].imagen}
                            key={orden.suborden_id}
                        />

                    ))}

                </div>

                <div className="modalFooter">

                    <div className="modalSubDivisionSpaceArround">
                        <button
                            className="modalBoton"
                            onClick={ cerrarModalOrdenes }
                        >
                        Cerrar
                        </button>
                    </div>

                </div>

            </div>

        </div>
    )
}