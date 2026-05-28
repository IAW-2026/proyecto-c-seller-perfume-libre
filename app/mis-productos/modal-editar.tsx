"use client";

import Image from "next/image";
import { Producto } from '@/lib/db/db';
import styles from "./modal-editar.module.css";

interface Props {

    producto: Producto;

    cerrar: () => void;

    guardar: () => void;

    setTitulo:
    (valor: string) => void;

    setPrecio:
    (valor: number) => void;

    setAgregarStock:
    (valor: number) => void;
}

export default function ModalEditar({ producto, cerrar, guardar, setTitulo, setPrecio, setAgregarStock }: Props) {
    return (
        <div className={styles.modalFondo }>

            <div className={styles.modal }>

                <div className={styles.modalDivSuperior }>

                    <div className={styles.modalContenedorImagen }>

                        <Image
                            src={producto.imagen}
                            alt={producto.titulo}
                            fill
                            className={styles.modalProductoImagen }
                            sizes="100px"
                        />

                    </div>

                    <button className={styles.modalBoton }
                    >
                        Editar Imagen
                    </button>

                </div>

                <div className={styles.modalDivMedio }>

                    <p>Titulo</p>

                    <input
                        className={styles.modalInputTexto }
                        type = "text"
                        defaultValue = { producto.titulo }
                        onChange={ (e) => setTitulo( e.target.value ) }
                    />

                    <p>Precio</p>

                    <input
                        className={styles.modalInputTexto}
                        type = "number"
                        defaultValue = { producto.precio }
                        onChange={(e) => setPrecio(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                    />

                    <p>Agregar Stock</p>

                    <input
                        className={styles.modalInputTexto}
                        type = "number"
                        min = "0"
                        step = "1"
                        defaultValue = "0"
                        onChange={(e) => setAgregarStock(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                    />

                </div>

                <div className={styles.modalDivInferior }>

                    <button className={styles.modalBoton} onClick={async () => { await guardar(); } }
                    >
                        Guardar
                    </button>

                    <button
                        className={styles.modalBoton}
                        onClick = { cerrar }
                    >
                        Cancelar
                    </button>

                </div>

            </div>

        </div>

    );
}