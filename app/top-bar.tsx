'use client'

import "./top-bar.css";
import { Show, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { useAppContext } from './appContext';

export default function TopBar() {

    const path = usePathname();
    const { abrirModalCrear } = useAppContext();

    return (
        <Show when="signed-in">
            <div className="topBar">
                <h1 className="topBarText">Perfume Libre</h1>

                {path === "/mis-productos" && (
                    <button
                        className="topBar-publicar-producto"
                        onClick={ abrirModalCrear }
                    >
                        Publicar Producto
                    </button>
                )}

                <UserButton/>
            </div>
        </Show>
    );
}