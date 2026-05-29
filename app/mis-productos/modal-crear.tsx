'use client'

import styles from "./modal-crear.module.css";
import Image from "next/image";
import { useAppContext } from '@/app/appContext';
import { useState } from 'react';
import { PublicarProducto } from '@/lib/db/db';

export default function ModalCrear() {
    const { cerrarModalCrear } = useAppContext();

    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState(0);
    const [stock, setStock] = useState(0);
    const [descripcion, setDescripcion] = useState("");
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState("");

    async function subirImagen() {
        if (!imagenFile)
            return;

        const formData = new FormData();
        formData.append("file", imagenFile);
        const response = await fetch("api/subir-imagen", { method: "POST", body: formData });
        const data = await response.json();
        return data.url;
    }

    async function publicarProducto() {
        console.log(imagenFile);

        const url = await subirImagen();
        await PublicarProducto(titulo, descripcion, precio, stock, "activo", url);

        cerrarModalCrear();
    }

    return (
        <div className={ styles.modalFondo }>

            <div className={ styles.modal }>

                <div className={styles.modalDivSuperior}>

                    <label className={styles.modalBoton}>

                        Seleccionar Imagen

                        <input
                            type="file"
                            accept="image/*"
                            className={styles.inputFile}
                            onChange={(e) => {
                                const file =e.target.files?.[0];

                                if (!file)
                                    return;

                                setImagenFile(file);

                                setPreviewURL(URL.createObjectURL(file));
                            }}
                        />

                    </label>

                    {(previewURL != "") && (

                        <div className={styles.modalContenedorImagen }>
                            <Image
                                src={previewURL}
                                alt="Preview"
                                width={50}
                                height={100}
                                className={styles.productoImagen }
                            />
                        </div>
                    )}

                </div>

                <div className={styles.modalDivMedio}>

                    <p>Titulo</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                    />

                    <p>Descripcion</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
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
                        min="1"
                        step="1"
                        defaultValue=""
                        onChange={(e) => setStock(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                    />
                </div>

                <div className={styles.modalDivInferior}>

                    <button className={styles.modalBoton} onClick={async () => { await publicarProducto(); } }
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