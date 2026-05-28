
import styles from "./modal-domicilio.module.css"
import { useState } from 'react';
import { useAppContext } from '@/app/appContext';
import { CrearYAsignarDomicilio, ActualizarDomicilio } from '@/lib/db/actions'
import { Domicilio } from '@/lib/db/schemes'

interface Props {
    forzarIngresarDireccion: boolean;
    domicilio: Domicilio;
}

export default function ModalDomicilio({ forzarIngresarDireccion, domicilio }: Props) {
    const [calle, setCalle] = useState(forzarIngresarDireccion ? "" : domicilio.calle);
    const [ciudad, setCiudad] = useState(forzarIngresarDireccion ? "" : domicilio.ciudad);
    const [provincia, setProvincia] = useState(forzarIngresarDireccion ? "" : domicilio.provincia);
    const [codigo_postal, setCodigo_postal] = useState(forzarIngresarDireccion ? "" : domicilio.codigo_postal);

    const { cerrarModalDomicilio } = useAppContext();

    async function confirmar() {
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
        <div className={styles.modalFondo}>

            <div className={styles.modal}>

                <div className={styles.modalDivSuperior}>

                    {forzarIngresarDireccion && (
                        <p className={styles.primeraVezTitulo }>Antes de empezar a publicar debemos saber tu ubicacion</p>
                    )}

                    <p className={styles.modalTexto }>Calle</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={forzarIngresarDireccion ? "" : domicilio.calle}
                        onChange={(e) => setCalle(e.target.value)}
                    />

                    <p className={styles.modalTexto}>Ciudad</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={forzarIngresarDireccion ? "" : domicilio.ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                    />

                    <p className={styles.modalTexto}>Provincia</p>

                    <input
                        className={styles.modalInputTexto}
                        type="text"
                        defaultValue={forzarIngresarDireccion ? "" : domicilio.provincia}
                        onChange={(e) => setProvincia(e.target.value)}
                    />

                    <p className={styles.modalTexto}>Codigo Postal</p>

                    <input
                        className={styles.modalInputTexto}
                        type="number"
                        defaultValue={forzarIngresarDireccion ? "" : domicilio.codigo_postal }
                        onChange={(e) => setCodigo_postal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "e" || e.key === "E" || e.key === "+" || e.key === "-") { e.preventDefault(); } }}
                    />

                </div>

                <div className={styles.modalDivInferior}>

                    <button
                        className={styles.modalBoton}
                        onClick={async () => { await confirmar(); } }
                    >
                        Confirmar
                    </button>

                    {!forzarIngresarDireccion && (
                        <button
                            className={styles.modalBoton}
                            onClick={cerrarModalDomicilio}
                        >
                            Cancelar
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}