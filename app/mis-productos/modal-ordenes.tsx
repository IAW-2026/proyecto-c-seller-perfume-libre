'use client'

import styles from "./modal-ordenes.module.css";

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
        <div className={styles.modalFondo}>

            <div className={styles.modal}>

                <div className={styles.divSuperior}>

                    <div className={styles.contenedorCards}>

                        {ordenes.filter((suborden)=>suborden.estado==="en_preparacion").map((orden, index) => (

                            <CardOrden
                                titulo={productosOrdenes[index].titulo}
                                cantidad={orden.cantidad}
                                idOrden={orden.suborden_id}
                                imagen={productosOrdenes[index].imagen }
                                key={orden.suborden_id}
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