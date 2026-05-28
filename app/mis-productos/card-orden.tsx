'use client'

import styles from "./card-orden.module.css";

import Image from 'next/image';
import { OrdenAPrepararHecha } from '@/lib/db/actions';

interface Props {
    idOrden: number;
    titulo: string;
    cantidad: number;
    imagen: string;
}

export default function CardOrden({ idOrden, titulo, cantidad, imagen }: Props) {

    async function ordenHecha(idOrden: number) {
        await OrdenAPrepararHecha(idOrden);
    }

    return (
        <div className={styles.cardOrden}>
            <div className={styles.contenedorImagen}>
                <Image
                    src={imagen}
                    alt={titulo}
                    fill
                    className={styles.imagen}
                    sizes="100px"
                />
            </div>
            <p>{ titulo }</p>
            <p>{ `Cantidad: ${cantidad}` }</p>
            <button className={styles.boton} onClick={async () => { await ordenHecha(idOrden); } }
            >
            Confirmar Orden Hecha
            </button>
        </div>
    );
}