"use client";

import Image from "next/image";
import { Producto, EditarProducto, EditarCategorias } from '@/lib/db/db';
import './modal.css';
import { useLayoutEffect, useRef, useState } from 'react';
import { useAppContext } from "../appContext";

interface Props {
    producto: Producto;
    cerrar: () => void;
    categoriasDeProducto: string[];
}

export default function ModalEditar({ producto, categoriasDeProducto, cerrar }: Props) {

    const [agregandoCategoria, setAgregandoCategoria] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [titulo, setTitulo] = useState(producto.titulo);
    const [descripcion, setDescripcion] = useState(producto.descripcion);
    const [precio, setPrecio] = useState(producto.precio.toString());
    const [agregarStock, setAgregarStock] = useState("0");
    const [categorias, setCategorias] = useState<string[]>(categoriasDeProducto);
    const { abrirModalError } = useAppContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    function ajustarAltura() {
        if (!textareaRef.current) return;

        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
            `${textareaRef.current.scrollHeight}px`;
    }

    useLayoutEffect(() => {
        ajustarAltura();

        const textarea = textareaRef.current;
        if (!textarea) return;

        const observer = new ResizeObserver(() => { ajustarAltura(); });
        observer.observe(textarea.parentElement!);

        return () => observer.disconnect();
    }, []);

    function verificarInput() {
        if (titulo === "") {
            abrirModalError("Ingrese un titulo.");
            return false;
        }
        if (precio === "" || precio === "0") {
            abrirModalError("Ingrese un precio.");
            return false;
        }
        if (agregarStock === "") {
            abrirModalError("Ingrese un agregar stock");
            return false;
        }

        if (Number.isNaN(Number(precio))) {
            abrirModalError("Ingrese un precio valido");
            return false;
        }

        if (Number.isNaN(Number(agregarStock))) {
            abrirModalError("Ingrese un stock valido");
            return false;
        }

        return true;
    }

    function categoriasIguales(a: string[], b: string[]) {
        if (a.length !== b.length) {
            return false;
        }

        return a.every((valor, index) => valor === b[index]);
    }

    async function guardar() {
        if (!verificarInput()) {
            return;
        }

        const result = await EditarProducto(producto.producto_id, producto.vendedor_id, titulo, descripcion, Number(precio), producto.stock + Number(agregarStock), producto.imagen);

        if (result.success) {
            if (!categoriasIguales(categoriasDeProducto, categorias)) {
                const result2 = await EditarCategorias(producto.producto_id, categorias);

                if (result2.success) {
                    cerrar();
                } else {
                    abrirModalError(result2.error!.description!);
                }
            }

            cerrar();
        }
        else {
            abrirModalError(result.error!.description!);
        }
    }

    return (

        <div className="modalFondo">

            <div className="modal">

                <div className="modalScroll">

                    <div className="modalSubDivisionSpaceArround">

                        <div className="modalContenedorImagen">

                            <Image
                                src={producto.imagen}
                                alt={producto.titulo}
                                sizes="100px"
                                width={100}
                                height={100}
                                style={{ width: "auto", height: "100px" }}
                            />

                        </div>

                    </div>

                    <div className="modalSubDivisionColumn">

                        <p>Titulo</p>

                        <input
                            className="modalInputTexto"
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                        />

                        <p>Descripcion</p>

                        <textarea
                            ref={textareaRef}
                            className="modalInputTextoMultiLinea"
                            value={descripcion}
                            onChange={(e) => { setDescripcion(e.target.value); }}
                        />

                        <p>Precio</p>

                        <input
                            className="modalInputTexto"
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                        />

                        <p>Agregar Stock</p>

                        <input
                            className="modalInputTexto"
                            type="number"
                            min="0"
                            step="1"
                            value={agregarStock}
                            onChange={(e) => setAgregarStock(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                        />

                        <p>Categorias</p>

                        <div className="categoriasContainer">

                            {categorias.map((categoria) => (
                                <div key={categoria} className="categoriaTag">

                                    {`${categoria}`}

                                    <button
                                        className="categoriasEliminar"
                                        onClick={() => { setCategorias(categorias.filter((e) => e !== categoria)); }}
                                    >
                                        x
                                    </button>

                                </div>
                            )
                            )}

                            {!agregandoCategoria && (
                                <button
                                    className="categoriaBoton"
                                    onClick={() => setAgregandoCategoria(true)}
                                >
                                    +
                                </button>

                            )}

                            {agregandoCategoria && (
                                <input
                                    className="inputCategoria"
                                    size={Math.min(Math.max(nuevaCategoria.length, 1), 20)}
                                    autoFocus
                                    value={nuevaCategoria}
                                    onChange={(e) => {
                                        if (e.target.value.length >= 20) {
                                            e.target.value = nuevaCategoria;
                                        } else {
                                            setNuevaCategoria(e.target.value);
                                        }
                                    }}
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

                                            if (!categorias.includes(nuevaCategoria)) {
                                                setCategorias([...categorias, nuevaCategoria.trim()]);

                                                setNuevaCategoria("");

                                                setAgregandoCategoria(false);
                                            }
                                        }
                                    }}
                                />
                            )}

                        </div>

                    </div>

                </div>

                <div className="modalFooter">
                    <div className="modalSubDivisionSpaceArround">

                        <button
                            className="modalBoton"
                            onClick={async () => { await guardar(); }}
                        >
                            Guardar
                        </button>

                        <button
                            className="modalBoton"
                            onClick={cerrar}
                        >
                            Cancelar
                        </button>

                    </div>
                </div>

            </div>

        </div>

    );
}