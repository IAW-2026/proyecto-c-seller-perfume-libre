'use client'

import styles from "./modal-crear.module.css";
import Image from "next/image";
import { useAppContext } from '@/app/appContext';
import { useState } from 'react';
import { PublicarProducto } from '@/lib/db/db';

const imagenes = [
    "/1.png",
    "/2.png",
    "/3.png"
];

export default function ModalCrear() {
    const { cerrarModalCrear } = useAppContext();

    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState(0);
    const [imagenSeleccionada, setImagenSeleccionada] = useState("/1.png");
    const [stock, setStock] = useState(0);

    async function publicarProducto() {
        await PublicarProducto(titulo, precio, stock, imagenSeleccionada);
        cerrarModalCrear();
    }

    return (
        <div className={ styles.modalFondo }>

            <div className={ styles.modal }>

                <div className={styles.modalDivSuperior}>

                <p>Seleccionar Foto</p>

                    <div className={styles.modalDivSuperiorImagenes }>
                        {imagenes.map((imagen) => (
                            <div className={styles.modalContenedorImagen} key={imagen}>
                                <button
                                    className={styles.modalBotonImagen}
                                    onClick={() => setImagenSeleccionada(imagen) }
                                >
                                    <Image
                                        src={imagen}
                                        alt="imagen"
                                        fill
                                        className={imagenSeleccionada === imagen ? styles.productoImagenSeleccionada : styles.productoImagen}
                                        sizes="(max-width: 100px) 100vw, (max-width: 50px) 100vw"
                                        loading="eager">
                                    </Image>
                                </button>
                            </div>


                        ))}
                    </div>

                </div>

                <div className={styles.modalDivMedio}>

                    <p>Titulo</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <p>Precio</p>

                    <input
                        className={styles.modalInputTexto}
                        type="number"
                        defaultValue=""
                        onChange={(e) => setPrecio(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                    />

                    <p>Stock Inicial</p>

                    <input
                        className={styles.modalInputTexto}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue=""
                        onChange={(e) => setStock(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                    />
                </div>

                <div className={styles.modalDivInferior}>

                    <button className={styles.modalBoton} onClick={publicarProducto}
                    >
                        Publicar Producto
                    </button>

                    <button
                        className={styles.modalBoton}
                        onClick={cerrarModalCrear}
                    >
                        Cancelar
                    </button>

                </div>

            </div>

        </div>
    );
}