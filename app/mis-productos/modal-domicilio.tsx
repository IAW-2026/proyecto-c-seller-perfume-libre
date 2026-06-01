import { useState } from 'react';
import { useAppContext } from '@/app/appContext';
import { CrearYAsignarDomicilio, ActualizarDomicilio } from '@/lib/db/actions'
import { Domicilio } from '@/lib/db/schemes'
import './modal.css';

interface Props {
    forzarIngresarDireccion: boolean;
    domicilio: Domicilio;
}

export default function ModalDomicilio({ forzarIngresarDireccion, domicilio }: Props) {
    const [calle, setCalle] = useState(forzarIngresarDireccion ? "" : domicilio.calle);
    const [ciudad, setCiudad] = useState(forzarIngresarDireccion ? "" : domicilio.ciudad);
    const [provincia, setProvincia] = useState(forzarIngresarDireccion ? "" : domicilio.provincia);
    const [codigo_postal, setCodigo_postal] = useState(forzarIngresarDireccion ? "" : domicilio.codigo_postal.toString());
    const [error, setError] = useState<string | null>(null);

    const { cerrarModalDomicilio } = useAppContext();

    function verificarInput() {
        if (calle === "") { 
            setError("Ingrese una calle.");
            return false;
        }
        if (ciudad === "") {
            setError("Ingrese una ciudad.");
            return false;
        }
        if (provincia === "") {
            setError("Ingrese una provincia.");
            return false;
        }
        if (codigo_postal === "") {
            setError("Ingrese un codigo postal.");
            return false;
        }

        return true;
    }

    async function confirmar() {
        if (!verificarInput()) {
            return;
        }

        if (forzarIngresarDireccion) {
            await CrearYAsignarDomicilio(calle, ciudad, provincia, Number(codigo_postal));
            cerrarModalDomicilio();
        }
        else {
            await ActualizarDomicilio({domicilio_id: domicilio.domicilio_id, calle: calle, provincia:provincia, ciudad:ciudad, codigo_postal:Number(codigo_postal)});
            cerrarModalDomicilio();
        }
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

                            {forzarIngresarDireccion && (
                                <div className="modalSubDivisionColumn">

                                    <b style={{ textAlign: "center", margin:"10px"}}>Antes de empezar a publicar debemos saber tu ubicacion</b>
                                </div>
                            )}

                            <div className="modalSubDivisionColumn">

                                <p>Calle</p>

                                <input
                                    className="modalInputTexto"
                                    type="text"
                                    value={calle }
                                    onChange={(e) => setCalle(e.target.value)}
                                />

                                <p>Ciudad</p>

                                <input
                                    className="modalInputTexto"
                                    type="text"
                                    value={ciudad }
                                    onChange={(e) => setCiudad(e.target.value)}
                                />

                                <p>Provincia</p>

                                <input
                                    className="modalInputTexto"
                                    type="text"
                                    value={provincia }
                                    onChange={(e) => setProvincia(e.target.value)}
                                />

                                <p>Codigo Postal</p>

                                <input
                                    className="modalInputTexto"
                                    type="number"
                                    value={codigo_postal }
                                    onChange={(e) => setCodigo_postal(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                                />

                            </div>
                        </div>

                        <div className="modalFooter">
                            <div className="modalSubDivisionSpaceArround">

                                <button
                                    className="modalBoton"
                                    onClick={async () => { await confirmar(); }}
                                >
                                    Confirmar
                                </button>

                                {!forzarIngresarDireccion && (
                                    <button
                                        className="modalBoton"
                                        onClick={cerrarModalDomicilio}
                                    >
                                        Cancelar
                                    </button>
                                )}

                            </div>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}