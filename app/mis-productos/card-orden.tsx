'use client'

import styles from "./card-orden.module.css";

import Image from 'next/image';
import { OrdenAPrepararHecha } from '@/lib/db/actions';
import { useState } from 'react';

interface Props {
    idOrden: number;
    titulo: string;
    cantidad: number;
    imagen: string;
}

export default function CardOrden({ idOrden, titulo, cantidad, imagen }: Props) {

    const [error, setError] = useState<string | null>(null);

    async function ordenHecha(idOrden: number) {
        const result = await OrdenAPrepararHecha(idOrden);

        if (!result.success) {
            setError(result.error!.description);
        }
    }

    return (
        <>
            {error && (
                <div style={{zIndex:10}} className="modalFondo">

                    <div className="modal">

                        <p style={{ textAlign: "center" }}>{`${error}`}</p>

                        <button
                            className="modalBoton"
                            onClick={() => { setError(null); }}
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

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
                <p>{titulo}</p>
                <p>{`Cantidad: ${cantidad}`}</p>
                <button className={styles.boton} onClick={async () => { await ordenHecha(idOrden); }}
                >
                    Confirmar Orden Hecha
                </button>
            </div>
        </>
    );
}