
interface Props {
    producto: string;
    resena: string;
    puntaje: number;
}

export default function CardResenaProducto({ producto, puntaje, resena }: Props) {
    return (
        <div className="div_resena">
            <p>{`Producto: ${producto}`}</p>
            <p>{`Reseña: ${resena}`}</p>
            <p>{`Puntaje: ${puntaje}/5`}</p>
        </div>
    );
}