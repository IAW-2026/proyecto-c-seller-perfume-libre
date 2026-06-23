'use client'

import "./top-bar.css";
import { Show, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useAppContext } from './appContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { EsAdmin } from "../lib/es-admin";

interface AccionTopBar {
    texto: string;
    onClick: () => void;
}

interface Props {
    admin: boolean;
}

export default function TopBar({ admin }: Props) {

    const path = usePathname();
    const { abrirModalCrear, abrirModalOrdenes, abrirModalDomicilio } = useAppContext();
    const [menuAbierto, setMenuAbierto] = useState(false);

    const acciones: AccionTopBar[] = [];

    const router = useRouter();

    if (path === "/mis-productos") {
        acciones.push(
            {
                texto: "Publicar Producto",
                onClick: abrirModalCrear,
            },
            {
                texto: "Ver Ordenes",
                onClick: abrirModalOrdenes,
            },
            {
                texto: "Cambiar Domicilio",
                onClick: abrirModalDomicilio,
            },
            {
                texto: "Ver mis reseñas",
                onClick: () => router.push("/resenas"),
            }
        );
    }

    if (path === "/resenas") {
        acciones.push({
            texto: "Ver mis productos",
            onClick: () => router.push("/mis-productos"),
        });
    }

    if (admin && path !== "/seller/admin") {
        acciones.push({
            texto: "Panel Admin",
            onClick: () => router.push("/seller/admin")
        });
    }

    if (path === "/seller/admin") {
        acciones.push(
            {
                texto: "Ver mis productos",
                onClick: () => router.push("/mis-productos"),
            },
            {
                texto: "Ver mis reseñas",
                onClick: () => router.push("/resenas"),
            }
        );
    }

    return (
        <Show when="signed-in">
            <div className="topBar">
                <h1 className="topBarText">Perfume Libre</h1>

                <div className="topBar-botones">

                    {acciones.map(accion => (
                        <button
                            key={accion.texto}
                            className="topBar-boton"
                            onClick={accion.onClick}
                        >
                            {accion.texto}
                        </button>
                    ))}

                </div>

                {acciones.length > 0 && (
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

                                {acciones.map(accion => (
                                    <button
                                        key={accion.texto}
                                        className="botonMenuMobile"
                                        onClick={() => {
                                            accion.onClick();
                                            setMenuAbierto(false);
                                        }}
                                    >
                                        {accion.texto}
                                    </button>
                                ))}

                            </div>

                        )}

                    </div>
                )}

                <UserButton />

            </div>

        </Show>
    );
}