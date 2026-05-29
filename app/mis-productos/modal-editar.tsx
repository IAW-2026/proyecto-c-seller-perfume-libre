"use client";

import Image from "next/image";
import { Producto } from '@/lib/db/db';
import styles from "./modal-editar.module.css";
import { useState } from 'react';

interface Props {

    producto: Producto;
    categorias: string[];

    cerrar: () => void;
    guardar: () => void;

    setTitulo:(valor: string) => void;
    setDescripcion: (valor: string) => void;
    setCategorias: (categoria: string[]) => void;
    setPrecio: (valor: number) => void;
    setAgregarStock: (valor: number) => void;
}

export default function ModalEditar({ producto, cerrar, guardar, setTitulo, setPrecio, setDescripcion, setCategorias, categorias, setAgregarStock }: Props) {

    const [agregandoCategoria, setAgregandoCategoria] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState("");

    return (
        <div className={styles.modalFondo }>

            <div className={styles.modal }>

                <div className={styles.modalDivSuperior }>

                    <div className={styles.modalContenedorImagen }>

                        <Image
                            src={producto.imagen }
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

                    <p>Descripcion</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={producto.descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
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

                    <p>Categorias</p>

                    <div className={styles.categoriasContainer}>

                        {categorias.map((categoria) => (
                            <div key={categoria} className={styles.categoriaTag}>

                                {`${categoria}`}

                                <button
                                    className={styles.categoriasEliminar}
                                    onClick={() => { setCategorias(categorias.filter((e) => e !== categoria)); }}
                                >
                                    x
                                </button>

                            </div>
                        )
                        )}

                        {!agregandoCategoria && (
                            <button
                                className={styles.categoriaBoton}
                                onClick={() => setAgregandoCategoria(true)}
                            >
                                +
                            </button>

                        )}

                        {agregandoCategoria && (
                            <input
                                className={styles.inputCategoria}
                                size={
                                    Math.min(
                                        Math.max(
                                            nuevaCategoria.length,
                                            1
                                        ),
                                        20
                                    )
                                }
                                autoFocus
                                value={nuevaCategoria}
                                onChange={(e) =>
                                    setNuevaCategoria(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setAgregandoCategoria(false);
                                        setNuevaCategoria("");
                                    }

                                    if (e.key === "Backspace" && nuevaCategoria === "") {
                                        setAgregandoCategoria(false);
                                        setNuevaCategoria("");
                                    }

                                    if (e.key === "Enter") {
                                        e.preventDefault();

                                        if (nuevaCategoria.trim() === "") {
                                            return;
                                        }

                                        setCategorias([...categorias, nuevaCategoria.trim()]);

                                        setNuevaCategoria("");

                                        setAgregandoCategoria(false);
                                    }
                                }}
                            />
                        )}

                    </div>

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