'use client'

import { redirect } from "next/navigation";
import './not-found.css'

export default function NotFound() {
    return (
        <div className="notFoundDivFondo">

            <div className="notFoundDivPrincipal">

                <p>No se encontro lo que buscabas</p>

                <button
                    className="notFoundBoton"
                    onClick={() => redirect("/mis-productos")}
                >
                    Ir a mis productos
                </button>

            </div>

        </div>
    );
}