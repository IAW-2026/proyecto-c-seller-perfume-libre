'use client';

import { redirect } from 'next/navigation';
import './error.css';

export default function Error({ error, reset, }: { error: Error; reset: () => void; }) {
    return (
        <div className="errorDivFondo">

            <div className="errorDivPrincipal">

                <p>Ocurrió el siguiente error</p>
                <b>{error.message}</b>
            
                <button
                    className="errorBoton"
                    onClick={() => reset()}
                >
                    Reintentar
                </button>

                <button
                    className="errorBoton"
                    onClick={() => redirect("/mis-productos")}
                >
                    Ir a mis productos
                </button>

            </div>

        </div>
    );
}