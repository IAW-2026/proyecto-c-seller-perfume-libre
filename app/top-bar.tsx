'use client'

import "./top-bar.css";
import { Show, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useAppContext } from './appContext';
import { useState } from 'react';
import { redirect } from 'next/navigation'

export default function TopBar() {

    const path = usePathname();
    const { abrirModalCrear, abrirModalOrdenes, abrirModalDomicilio } = useAppContext();
    const [menuAbierto, setMenuAbierto] = useState(false);

    return (
        <Show when="signed-in">
            <div className="topBar">
                <h1 className="topBarText">Perfume Libre</h1>

                {path === "/mis-productos" && (
                    <div className="topBar-botones">
                        <button
                            className="topBar-boton"
                            onClick={ abrirModalCrear }
                        >
                            Publicar Producto
                        </button>
                        <button
                            className="topBar-boton"
                            onClick={ abrirModalOrdenes }
                        >
                            Ver Ordenes
                        </button>
                        <button
                            className="topBar-boton"
                            onClick={abrirModalDomicilio}
                        >
                            Cambiar Domicilio
                        </button>
                        <button
                            className="topBar-boton"
                            onClick={() => { redirect("/resenas") }}
                        >
                            Ver mis reseñas
                        </button>
                    </div>
                )}

                {path === "/resenas" && (
                    <div className="topBar-botones">
                        <button
                            className="topBar-boton"
                            onClick={() => { redirect("/mis-productos") } }
                        >
                            Ver mis productos
                        </button>
                    </div>
                )}

                <div className="menuContainer">

                    <button
                        className="botonHamburguesa"
                        onClick={() =>
                            setMenuAbierto(!menuAbierto)
                        }
                    >
                        ☰
                    </button>

                    {menuAbierto && (

                        <div className="menuMobile">

                            <button
                                className="botonMenuMobile"
                                onClick={() => { abrirModalCrear(); setMenuAbierto(false); } }
                            >
                                Publicar Producto
                            </button>

                            <button
                                className="botonMenuMobile"
                                onClick={() => { abrirModalOrdenes(); setMenuAbierto(false); }}
                            >
                                Ver Órdenes
                            </button>

                            <button
                                className="botonMenuMobile"
                                onClick={() => { abrirModalDomicilio(); setMenuAbierto(false); }}
                            >
                                Cambiar Domicilio
                            </button>

                            {path === "/mis-productos" && (
                                <button
                                    className="botonMenuMobile"
                                    onClick={() => { setMenuAbierto(false); redirect("/resenas"); }}
                                >
                                    Ir a mis reseñas
                                </button>
                            )}

                            {path === "/resenas" && (
                                <button
                                    className="botonMenuMobile"
                                    onClick={() => { setMenuAbierto(false); redirect("/mis-productos"); }}
                                >
                                    Ir a mis productos
                                </button>
                            )}

                        </div>

                    )}

                </div>

                <UserButton/>
            </div>



        </Show>
    );
}