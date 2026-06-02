"use client";

import {
    createContext,
    useContext,
    useState
} from "react";

interface AppContextType {
    modalCrearAbierto: boolean;
    modalOrdenesAbierto: boolean;
    modalDomicilioAbierto: boolean;
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

    function abrirModalCrear() { setModalCrearAbierto(true); }
    function cerrarModalCrear() { setModalCrearAbierto(false); }
    function abrirModalOrdenes() { setModalOrdenesAbierto(true); }
    function cerrarModalOrdenes() { setModalOrdenesAbierto(false); }
    function abrirModalDomicilio() { setModalDomicilioAbierto(true); }
    function cerrarModalDomicilio() { setModalDomicilioAbierto(false); }

    return (

        <AppContext.Provider value={{ modalCrearAbierto, modalOrdenesAbierto, modalDomicilioAbierto, abrirModalCrear, cerrarModalCrear, abrirModalOrdenes, cerrarModalOrdenes, abrirModalDomicilio, cerrarModalDomicilio }} >
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