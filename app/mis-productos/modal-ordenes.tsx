'use client'

import styles from "./modal-ordenes.module.css";

import { useAppContext } from '@/app/appContext';
import { OrdenAPreparar, Producto } from '@/lib/db/db';
import { ObtenerOrdenesAPreparar, ObtenerProductos } from '@/lib/db/actions';
import CardOrden from './card-orden';

interface Props {
    ordenes: OrdenAPreparar[];
    productosOrdenes: Producto[];
}

export default function ModalOrdenes({ ordenes, productosOrdenes }: Props) {

    const { cerrarModalOrdenes } = useAppContext();

    return (
        <div className={styles.modalFondo}>

            <div className={styles.modal}>

                <div className={styles.divSuperior}>

                    <div className={styles.contenedorCards}>

                        {ordenes.map((orden, index) => (

                            <CardOrden
                                titulo={productosOrdenes[index].titulo}
                                cantidad={orden.cantidad}
                                idOrden={orden.idOrdenAPreparar}
                                imagen={productosOrdenes[index].imagen }
                                key={orden.idOrdenAPreparar}
                            />

                        ))}

                     </div>

                </div>

                <div className={styles.divInferior}>

                    <button
                        className={styles.modalBoton}
                        onClick={ cerrarModalOrdenes }
                    >
                    Cerrar
                    </button>

                </div>

            </div>

        </div>
    )
}