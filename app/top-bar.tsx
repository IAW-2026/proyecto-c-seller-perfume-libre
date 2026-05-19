'use client'

import "./top-bar.css";
import { Show, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

function publicarProducto() {
    console.log('publicar producto');
}

export default function TopBar() {

    const path = usePathname();

    return (
        <Show when="signed-in">
            <div className="topBar">
                <h1 className="topBarText">Perfume Libre</h1>

                {path === "/mis-productos" && (
                    <button
                        className="topBar-publicar-producto"
                        onClick={ publicarProducto }
                    >
                        Publicar Producto
                    </button>
                )}

                <UserButton/>
            </div>
        </Show>
    );
}