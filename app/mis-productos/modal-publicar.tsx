'use client'

import Image from "next/image";
import { useAppContext } from '@/app/appContext';
import { useState } from 'react';
import { PublicarProducto } from '@/lib/db/db';
import './modal.css';

export default function ModalPublicar() {
    const { cerrarModalCrear } = useAppContext();

    const [titulo, setTitulo] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState("");
    const [categorias, setCategorias] = useState<string[]>([]);
    const [agregandoCategoria, setAgregandoCategoria] = useState(false);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function subirImagen() {
        if (!imagenFile)
            return;

        const formData = new FormData();
        formData.append("file", imagenFile);

        const response = await fetch("api/subir-imagen", { method: "POST", body: formData });

        const data = await response.json();

        return data.url;
    }

    function verificarInput() {
        if (titulo === "") {
            setError("Ingrese un titulo.");
            return false;
        }
        if (precio === "" || precio === "0") {
            setError("Ingrese un precio.");
            return false;
        }
        if (stock === "" || stock==="0") {
            setError("Ingrese un stock");
            return false;
        }
        if (imagenFile === null) {
            setError("Elija una imagen.");
            return false;
        }

        if (Number.isNaN(Number(precio))) {
            setError("Ingrese un precio valido.");
            return false;
        }
        if (Number.isNaN(Number(stock))) {
            setError("Ingrese un stock valido.");
            return false;
        }

        if (titulo.length > 20) {
            setError("Titulo demasiado largo.");
            return false;
        }
        if (descripcion.length > 50) {
            setError("Descripcion demasiada larga.");
            return false;
        }

        return true;
    }

    async function publicarProducto() {
        if (!verificarInput()) return;

        const url = await subirImagen();
        await PublicarProducto(titulo, descripcion, Number(precio), Number(stock), "activo", url, categorias);

        cerrarModalCrear();
    }

    return (
        <>
            {error && (
                <div className="modalFondo">

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

            {!error && (
                <div className="modalFondo">

                    <div className="modal">

                        <div className="modalScroll">
                            <div className="modalSubDivisionSpaceArround">

                                <label className="modalBoton">

                                    Seleccionar Imagen

                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{display:"none"} }
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];

                                            if (!file)
                                                return;

                                            setImagenFile(file);

                                            setPreviewURL(URL.createObjectURL(file));
                                        }}
                                    />

                                </label>

                                {(previewURL != "") && (

                                    <div className="modalContenedorImagen">
                                        <Image
                                            src={previewURL}
                                            alt="Preview"
                                            sizes="100px"
                                            width={100}
                                            height={100}
                                            style={{ width: "auto", height: "100px" }}
                                        />
                                    </div>
                                )}

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
                                    className="modalInputTextoMultiLinea"
                                    value={descripcion}
                                    onChange={(e) => {
                                        setDescripcion(e.target.value); 

                                        e.target.style.height = "auto";
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                />

                                <p>Precio</p>

                                <input
                                    className="modalInputTexto"
                                    type="number"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                                />

                                <p>Stock Inicial</p>

                                <input
                                    className="modalInputTexto"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
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

                                <button className="modalBoton" onClick={async () => { await publicarProducto(); }}
                                >
                                    Publicar Producto
                                </button>

                                <button
                                    className="modalBoton"
                                    onClick={cerrarModalCrear}
                                >
                                    Cancelar
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}