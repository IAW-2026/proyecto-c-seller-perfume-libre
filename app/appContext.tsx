"use client";

import { createContext, useContext, useState } from "react";
import './modal-error.css';
import './mis-productos/modal.css';

interface AppContextType {
    modalCrearAbierto: boolean;
    modalOrdenesAbierto: boolean;
    modalDomicilioAbierto: boolean;
    error: string | null;
    abrirModalError: (error: string) => void;
    cerrarModalError: () => void;
    abrirModalCrear: () => void;
    cerrarModalCrear: () => void;
    abrirModalOrdenes: () => void;
    cerrarModalOrdenes: () => void;
    abrirModalDomicilio: () => void;
    cerrarModalDomicilio: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function ContextProvider( { children }: { children: React.ReactNode; }) {

    const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
    const [modalOrdenesAbierto, setModalOrdenesAbierto] = useState(false);
    const [modalDomicilioAbierto, setModalDomicilioAbierto] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function abrirModalCrear() { setModalCrearAbierto(true); }
    function cerrarModalCrear() { setModalCrearAbierto(false); }
    function abrirModalOrdenes() { setModalOrdenesAbierto(true); }
    function cerrarModalOrdenes() { setModalOrdenesAbierto(false); }
    function abrirModalDomicilio() { setModalDomicilioAbierto(true); }
    function cerrarModalDomicilio() { setModalDomicilioAbierto(false); }
    function abrirModalError(error: string) { setError(error); }
    function cerrarModalError() { setError(null) }

    return (

        <AppContext.Provider value={{ error, cerrarModalError, abrirModalError, modalCrearAbierto, modalOrdenesAbierto, modalDomicilioAbierto, abrirModalCrear, cerrarModalCrear, abrirModalOrdenes, cerrarModalOrdenes, abrirModalDomicilio, cerrarModalDomicilio }} >
            {error && (
                <div style={{ zIndex: 10 }} className="modalErrorFondo">

                    <div className="modalError">

                        <p style={{ textAlign: "center" }}>{`${error}`}</p>

                        <button
                            className="modalErrorBoton"
                            onClick={() => { setError(null); }}
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

            {children}
        </AppContext.Provider>

    );
}

export function useAppContext() {

    const context =
        useContext(AppContext);

    if (!context) {
        throw new Error(
            "useAppContext fuera del provider"
        );
    }

    return context;
}