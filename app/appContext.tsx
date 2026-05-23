"use client";

import {
    createContext,
    useContext,
    useState
} from "react";

interface AppContextType {
    modalCrearAbierto: boolean;
    abrirModalCrear: () => void;
    cerrarModalCrear: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function ContextProvider( { children }: { children: React.ReactNode; }) {

    const [modalCrearAbierto, setModalCrearAbierto] = useState(false);

    function abrirModalCrear() { setModalCrearAbierto(true); }
    function cerrarModalCrear() { setModalCrearAbierto(false); }

    return (

        <AppContext.Provider value={{ modalCrearAbierto, abrirModalCrear, cerrarModalCrear }} >
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